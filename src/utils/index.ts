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
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 12) {
    return t('message.goodMorning')
  } else if (hour >= 12 && hour < 14) {
    return t('message.goodNoon')
  } else if (hour >= 14 && hour < 18) {
    return t('message.goodAfternoon')
  } else {
    return t('message.goodEvening')
  }
}

/**
 * 将秒数转换为易读的时间格式
 * - 小于60秒：显示为秒
 * - 60秒及以上：显示为分钟（舍去剩余秒数）
 * - 3600秒及以上：显示为小时+分钟
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  } else {
    const hours = Math.floor(seconds / 3600)
    const remainingSeconds = seconds % 3600
    const minutes = Math.floor(remainingSeconds / 60)

    if (minutes > 0) {
      return `${hours}小时${minutes}分钟`
    } else {
      return `${hours}小时`
    }
  }
}

/**
 * 将距离从米转换为更易读的格式（可配置小数位数）
 * @param meters 距离（单位：米）
 * @param decimalPlaces 公里显示时的小数位数，默认为1
 * @returns 格式化后的距离字符串
 */
export function formatDistanceAdvanced(
  meters: number,
  decimalPlaces: number = 1
): string {
  if (meters < 1000) {
    return `${meters}米`
  } else {
    const kilometers = meters / 1000
    const multiplier = Math.pow(10, decimalPlaces)
    const roundedKm = Math.round(kilometers * multiplier) / multiplier
    return `${roundedKm}公里`
  }
}
