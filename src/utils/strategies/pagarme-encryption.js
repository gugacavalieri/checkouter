import qs from 'querystringify'
import { JSEncrypt } from 'jsencrypt'
import URLS from './urls'

const API_VERSION = '2017-08-28'

const requestEncryptionKey = (encryptionKey) => {
  const url = `${URLS.pagarme.cardHashKey}?encryption_key=${encryptionKey}`

  const configs = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-PagarMe-Version': API_VERSION,
    },
    method: 'GET',
  }

  return fetch(url, configs)
    .then(response => response.json())
}

const generateQueryString = cardInfo => qs.stringify(cardInfo)

const encrypt = (cardString, publicKey, id) => {
  const jsEncrypt = new JSEncrypt()
  jsEncrypt.setPublicKey(publicKey)
  const encrypted = jsEncrypt.encrypt(cardString)
  const cardHash = `${id}_${encrypted}`
  return cardHash
}

// eslint-disable-next-line max-len
const generateCardHash = (cardInfo, encryptionKey) => requestEncryptionKey(encryptionKey)
  .then((response) => {
    const cardString = generateQueryString(cardInfo)
    return encrypt(cardString, response.public_key, response.id)
  })

export default {
  requestEncryptionKey,
  generateCardHash,
  generateQueryString,
  encrypt,
}
