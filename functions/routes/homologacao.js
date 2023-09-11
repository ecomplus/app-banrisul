exports.get = async ({ appSdk, admin }, req, res) => {
  const { orderId, request, response } = req.query
  let text = ''
  let typeFile = ''
  if (request) {
    text = Buffer.from(request, 'base64url').toString('utf-8')
    typeFile = 'resquest'
  } else if (response) {
    text = Buffer.from(response, 'base64url').toString('utf-8')
    typeFile = 'response'
  }
  res.attachment(`${typeFile}-${orderId}.json`)
  res.type('json')
  res.send(text)
}
