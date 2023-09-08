const geratePdf = require('../lib/billet/gerate-billet')

exports.get = async ({ appSdk, admin }, req, res) => {
  const collectionBillet = admin.firestore().collection('billets')
  try {
    const { orderId } = req.query
    const doc = await collectionBillet.doc(orderId).get()
    let billet
    if (doc) {
      billet = doc.data()
    }
    if (billet) {
      const { titulo, storeId } = billet

      if (!titulo?.beneficiario?.address || !titulo?.beneficiario?.zipCode) {
        const { beneficiario } = titulo
        const auth = await appSdk.getAuth(storeId)

        if (!titulo?.benifeciario?.zipCode) {
          const { response: { data: order } } = (await appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth))
          const zipCode = order?.shipping_lines[0]?.from?.zip
          if (zipCode) {
            Object.assign(beneficiario, { zipCode })
          }
        }

        if (!titulo?.benifeciario?.address) {
          const { response: { data: store } } = (await appSdk.apiRequest(storeId, '/stores/me.json', 'GET', null, auth))
          const address = store?.address

          if (address) {
            Object.assign(beneficiario, { address })
          }
        }
      }

      const bufferFile = await geratePdf(titulo, billet.isSandbox)
      res.setHeader('Content-Length', Buffer.byteLength(bufferFile))
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Cache-Control', 'public, max-age=60')
      res.setHeader('Content-Disposition', `attachment; filename=${orderId || 'Boleto-Banrisul'}.pdf`)
      res.send(bufferFile)
    } else {
      res.status(404)
        .send({
          error: 'Not Found',
          message: `Document #${orderId} not found`
        })
    }
  } catch (err) {
    console.error(err)
    res.status(500)
    const { message } = err
    res.send({
      error: 'BILLET_API_ERROR',
      message
    })
  }
}
