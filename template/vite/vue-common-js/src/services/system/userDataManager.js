const name = 'user.template'
const key = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse('QEDF$%@_($KLS'))
const iv = CryptoJS.MD5(CryptoJS.enc.Utf8.parse('Q#%@KD*5)7'))

/**
 * 將加密後的使用者資訊存至localstorage
 * @param data 
 */
const setUserData = (data) => {
  const ciphertext = encrypt(JSON.stringify(data), 1)
  if (localStorage.getItem(name) !== ciphertext) localStorage.setItem(name, ciphertext)
}

/**
 * 取得使用者資料
 * @returns 使用者資訊
 */
const getUserData = () => {
  const ciphertext = localStorage.getItem(name);

  if (ciphertext) {
    try {
      const decryptedStr = decrypt(ciphertext, 1);
      const data = JSON.parse(decryptedStr);
      return data
    } catch (error) {
      return null
    }
  }

  return null
}

/**
 * 從localstorage清除使用者資訊
 */
const clearData = () => {
  localStorage.clear()
}

/**
 * 取得檔案加密網址
 * @param data 加密的物件 
 * @returns 加密後的網址
 */
const encryptFileUrl = (data) => {
  const ciphertext = encrypt(JSON.stringify(data), 2)
  return ciphertext
}

export default {
  setUserData: setUserData,
  getUserData: getUserData,
  clearData: clearData,
  encryptFileUrl : encryptFileUrl
}

/**
 * 加密
 * @param data 來源
 * @param mode 加密模式
 * @returns 加密後的字串
 */
const encrypt = (data, mode) => {
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let result = (mode === 1) ? encrypted.toString() : encrypted.ciphertext.toString()
  return result;
}

/**
 * 解密
 * @param encrypted 加密字串
 * @param mode 加密模式
 * @returns 解密後的字串
 */
const decrypt = (encrypted, mode) => {
  const text = (mode === 1) ? encrypted : CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted))
  const decrypted = CryptoJS.AES.decrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
