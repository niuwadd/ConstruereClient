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
/**
 * 判断字符串是否为有效的JSON
 * @param str 
 * @returns boolean
 */
export function isValidJSON(str: string) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 根据当前时间返回相应的问候语
 * @returns {string} 问候语：早上好/中午好/下午好/晚上好
 */
export function getTimeGreeting(t: (key: string) => string) {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        return t('message.goodMorning');
    } else if (hour >= 12 && hour < 14) {
        return  t('message.goodNoon');
    } else if (hour >= 14 && hour < 18) {
        return t('message.goodAfternoon');
    } else {
        return t('message.goodEvening');
    }
}