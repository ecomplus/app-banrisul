const { baseUri } = require('../../../__env')
const Banrisul = require('../../../lib/banrisul/auth/create-access')
// const getOurNumber = require('../../../lib/banrisul/calculate-our-number')
const { createBodyToBillet } = require('../../../lib/banrisul/payload-to-billet')

exports.post = async ({ appSdk, admin }, req, res) => {
  const collectionBillet = admin.firestore().collection('billets')
  /**
   * Requests coming from Modules API have two object properties on body: `params` and `application`.
   * `application` is a copy of your app installed by the merchant,
   * including the properties `data` and `hidden_data` with admin settings configured values.
   * JSON Schema reference for the Create Transaction module objects:
   * `params`: https://apx-mods.e-com.plus/api/v1/create_transaction/schema.json?store_id=100
   * `response`: https://apx-mods.e-com.plus/api/v1/create_transaction/response_schema.json?store_id=100
   *
   * Examples in published apps:
   * https://github.com/ecomplus/app-pagarme/blob/master/functions/routes/ecom/modules/create-transaction.js
   * https://github.com/ecomplus/app-custom-payment/blob/master/functions/routes/ecom/modules/create-transaction.js
   */

  const { params, application } = req.body
  const { storeId } = req
  // merge all app options configured by merchant
  const appData = Object.assign({}, application.data, application.hidden_data)
  // setup required `transaction` response object

  const { amount } = params
  const orderId = params.order_id
  // indicates whether the buyer should be redirected to payment link right after checkout
  let redirectToPayment = false
  const transaction = {
    amount: amount.total
  }

  if (params.payment_method.code === 'banking_billet') {
    try {
      console.log('>> s: ', storeId, ' beneficiary Code: ', appData.beneficiary_code, ' envoriment: ', appData.envoriment)
      const auth = await appSdk.getAuth(storeId)
      const { response: { data: order } } = (await appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth))
      const zipCode = order?.shipping_lines[0]?.from?.zip

      const { response: { data: store } } = (await appSdk.apiRequest(storeId, '/stores/me.json', 'GET', null, auth))
      const address = store?.address

      const banrisul = new Banrisul(appData.client_id, appData.client_secret, storeId, appData.envoriment === 'teste')
      await banrisul.preparing

      // OBS.: in case it is necessary to calculate our number
      // const documentRef = banrisul.documentRef && await banrisul.documentRef.get()
      // const docAuthBarisul = documentRef?.data()
      // const lastBilletNumber = (docAuthBarisul?.lastBilletNumber || 0) + 1
      const banrisulAxios = banrisul.axios

      // const ourNumber = getOurNumber(lastBilletNumber)
      const body = createBodyToBillet(appData, params)

      console.log('>>body ', JSON.stringify(body))
      redirectToPayment = false

      // test
      // const data = require('../../../lib/billet/billet-test')
      if (!appData.beneficiary_code && appData.envoriment !== 'teste') {
        throw new Error('Beneficiary code not found')
      }

      const { data } = await banrisulAxios.post('/boletos', body, {
        headers: {
          'bergs-beneficiario': appData.envoriment === 'teste' ? '0010000001088' : appData.beneficiary_code
        }
      })

      console.log('>> boleto ', JSON.stringify(data))
      transaction.banking_billet = {
        code: data.titulo?.linha_digitavel,
        valid_thru: new Date(data.titulo?.data_vencimento).toISOString(),
        link: `${baseUri}/billet?orderId=${orderId}`
      }

      transaction.intermediator = {
        transaction_id: data?.titulo?.nosso_numero,
        transaction_reference: data?.titulo?.nosso_numero,
        transaction_code: data.retorno
      }

      const beneficiario = data.titulo?.beneficiario

      if (beneficiario) {
        if (zipCode) {
          Object.assign(beneficiario, { zipCode })
        }

        if (address) {
          Object.assign(beneficiario, { address })
        }
      }

      await collectionBillet.doc(orderId).set({ ...data, storeId, envoriment: appData.envoriment })

      // OBS.: in case it is necessary to calculate our number
      // banrisul.documentRef.set({ lastBilletNumber }, { merge: true })
      //   .catch(console.error)

      res.send({
        redirect_to_payment: redirectToPayment,
        transaction
      })
    } catch (error) {
      console.log(error.response)
      // try to debug request error
      const errCode = 'BANRISUL_TRANSACTION_ERR'
      let { message } = error
      const err = new Error(`${errCode} #${storeId} - ${orderId} => ${message}`)
      if (error.response) {
        const { status, data } = error.response
        if (status !== 401 && status !== 403) {
          err.payment = JSON.stringify(transaction)
          err.status = status
          if (typeof data === 'object' && data) {
            err.response = JSON.stringify(data)
          } else {
            err.response = data
          }
        } else if (data && Array.isArray(data.errors) && data.errors[0] && data.errors[0].message) {
          message = data.errors[0].message
        }
      }
      console.error(err)
      res.status(409)
      res.send({
        error: errCode,
        message
      })
    }
  }
}
