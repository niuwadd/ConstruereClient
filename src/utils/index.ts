export function isBase64(str: string) {
  if (typeof str !== 'string') {
    return false
  }

  // Base64正则表达式
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/

  // 检查是否符合Base64字符规则
  if (!base64Regex.test(str)) {
    return false
  }

  // 检查长度是否为4的倍数
  if (str.length % 4 !== 0) {
    return false
  }

  // 尝试解码验证
  try {
    return btoa(atob(str)) === str
  } catch (err) {
    return false
  }
}
/**
 * 生成uuid
 * @returns {string}
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}