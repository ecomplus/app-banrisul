const createAxios = require('./create-axios')
const getOAuth = require('./get-token')

module.exports = function (clientId, clientSecret, storeId, firestoreColl = 'banrisul_auth') {
  const self = this

  let documentRef

  if (firestoreColl) {
    documentRef = require('firebase-admin')
      .firestore()
      .doc(`${firestoreColl}/${storeId}`)
  }

  this.preparing = new Promise((resolve, reject) => {
    const authenticate = (accessToken, documentRef) => {
      self.axios = createAxios(accessToken)
      // self.documentRef = documentRef
      if (documentRef) {
        documentRef
          .set({ accessToken }, { merge: true })
          .catch(console.error)
      }
      resolve(self)
    }

    const handleAuth = () => {
      console.log('> Banrisul Auth02 ', storeId)
      getOAuth(clientId, clientSecret)
        .then((accessToken) => {
          console.log(`>> s:${storeId} token => ${accessToken}`)
          authenticate(accessToken, documentRef)
        })
        .catch(reject)
    }

    if (documentRef) {
      documentRef.get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists &&
            Date.now() - documentSnapshot.updateTime.toDate().getTime() <= 59 * 60 * 1000 // access token expires in 60 minutes
          ) {
            authenticate(documentSnapshot.get('accessToken'), documentRef)
          } else {
            handleAuth()
          }
        })
        .catch(console.error)
    } else {
      handleAuth()
    }
  })
}
