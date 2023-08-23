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
      const { titulo } = billet

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
