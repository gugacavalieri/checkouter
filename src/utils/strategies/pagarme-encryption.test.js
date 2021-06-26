/* eslint-disable max-len */
import 'whatwg-fetch'
import encryption from './pagarme-encryption'

const TEST_KEY = 'ek_test_Dj06JBJzzKDrJ2VY'
const CARD_INFO = {
  card_number: '4901720080344448',
  card_holder_name: 'Aardvark Silva',
  card_expiration_date: 1213,
  card_cvv: 314,
}


describe('pagarme-encryption.test.js', () => {
  describe('requestEncryptionKey', () => {
    it('should return an response when encryption key is invalid', (done) => {
      encryption.requestEncryptionKey('invalid').then((response) => {
        expect(response).toHaveProperty('public_key')
        expect(response).toHaveProperty('date_created')
        done()
      })
    })
    it('should return an valid json when encryption key is valid', (done) => {
      encryption.requestEncryptionKey(TEST_KEY)
        .then((response) => {
          expect(response).toHaveProperty('public_key')
          expect(response).toHaveProperty('date_created')
          done()
        })
    })
  })
  describe('generateQueryString', () => {
    it('should return empty string when no data is received', () => {
      const result = encryption.generateQueryString({})
      expect(result).toBe('')
    })
    it('should return qs string when data is received', () => {
      const result = encryption.generateQueryString(CARD_INFO)
      // eslint-disable-next-line max-len
      expect(result).toContain('card_number=4901720080344448&card_holder_name=Aardvark%20Silva&card_expiration_date=1213&card_cvv=314')
    })
  })
  describe('encrypt', () => {
    it('should return encrypted string', () => {
      const key = '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2NxEYWiWEa9er3Uey/7B\n' +
      'RX9scv7fcoz1QoAUtXlENqrZxlBjgcYx70TJcI2OPou4hKatYp8U/JjwLtGc/JEx\n' +
      'iIRo+LJLuyFeKyI4wqJP+l6e1+wX+MOKETl3IETcnQx3THLerKHsphcQ98ga8cVy\n' +
      'YQ1V7hq/CXgNJn2iTAEzywUjwbbJV9TFeTBVCYmo0A4XH+zHrkraSrx5yQ4c8Z/Y\n' +
      'ngP2cBSkyzXxZhiuX8xgXbcc8+uC+AzGmL2BiuHMYvLXDkVKL4jwuAUToPq8/W4b\n' +
      'EQsGVyI5dlRApsl4Ks8ZNgOgThv28bdP2FPlqKPd3gOW286DNkzaOxbCmW8sL618\n' +
      'BQIDAQAB\n' +
      '-----END PUBLIC KEY-----\n'
      const result = encryption.encrypt('card_number=4901720080344448&card_holder_name=Aardvark%20Silva&card_expiration_date=1213&card_cvv=314', key, 1234)
      expect(result.match(/\d+_.+/)).toHaveLength(1)
    })
  })
  describe('generateCardHash', () => {
    it('should return an valid card hash', (done) => {
      encryption.generateCardHash(CARD_INFO, TEST_KEY).then((response) => {
        expect(response.match(/\d+_.+/)).toHaveLength(1)
        done()
      })
    })
  })
})
