const Banrisul = require('./auth/create-access')
const getAppData = require('../store-api/get-app-data')

const parseStatus = {
  A: 'pending',
  B: 'voided',
  D: 'voided',
  L: 'paid',
  R: 'refunded',
  T: 'pending',
  P: 'pending'
}

module.exports = async (admin, appSdk) => {
  try {
    /*
      A = Ativo
      B = Baixado por pagamento // Cancelado
      D = Baixado por devolução // Cancelado
      L = Liquidado // PAGO
      R = Reembolsado
      T = Transferido para CL
      P = Protestado
    */
    const collectionBillet = admin.firestore().collection('billets')
    admin.firestore().collection('ecomplus_app_auth').get()
      .then(async (docsRef) => {
        const storeIds = []
        const apps = docsRef?.docs?.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })

        for (let i = 0; i < apps.length; i++) {
          const app = apps[i]
          const storeId = app.store_id
          console.log('>> StoreId: ', storeId)

          const docsBillets = (await collectionBillet.where('storeId', '==', storeId).get())
            ?.docs?.map((doc) => {
              return {
                ...doc.data(),
                orderId: doc.id,
                refDoc: doc.ref
              }
            })

          if (!storeIds.includes(storeId)) {
            storeIds.push(storeId)
            const auth = await appSdk.getAuth(storeId)
            const appData = await getAppData({ appSdk, storeId, auth })
            const banrisul = new Banrisul(appData.client_id, appData.client_secret, storeId)

            await banrisul.preparing
            const barisulAxios = banrisul.axios

            for (let j = 0; j < docsBillets.length; j++) {
              try {
                const { titulo, orderId, refDoc } = docsBillets[j]
                const idBoleto = titulo.nosso_numero
                console.log('>> orderId: ', orderId, ' nosso numero', idBoleto)

                const { data: billet } = await barisulAxios.get(
                  `/boletos/${idBoleto}`,
                  {
                    headers: {
                      'bergs-beneficiario': appData.beneficiary_code
                    }
                  }
                )

                console.log('> billet ', JSON.stringify(billet))

                const status = parseStatus[billet?.titulo?.situacao_banrisul] || 'pending'
                const parseDate = {
                  voided: billet?.titulo?.data_baixa,
                  paid: billet?.titulo?.data_pagamento,
                  refunded: billet?.titulo?.data_reembolso,
                  pending: Date.now()
                }

                console.log('> status ', status, ' date: ', parseDate[status])

                if (orderId) {
                  const { response: { data: order } } = (await appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth))

                  if (order && order.financial_status.current !== status) {
                    console.log('>> Update status ', status)
                    let transactionId
                    if (order.transactions && order.transactions[0]) {
                      transactionId = order.transactions[0]._id
                    }
                    const body = {
                      date_time: new Date(parseDate[status]).toISOString(),
                      status,
                      notification_code: `time:${new Date().toISOString()};`,
                      flags: ['Banrisul']
                    }

                    if (transactionId) {
                      body.transaction_id = transactionId
                    }

                    await appSdk.apiRequest(storeId, `orders/${order._id}/payments_history.json`, 'POST', body, auth)
                  }

                  if (status !== 'pending') {
                    console.log('Removing Billet')
                    await refDoc.delete()
                  }
                }
              } catch (error) {
                console.error(error)
              }
            }
          } else {
            console.log(`Already executed in the store #${storeId}`)
          }
        }
      })
  } catch (error) {
    console.error(error)
  }
}
