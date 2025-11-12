export default function useAudioConversion() {
  // 语音转文字
  const arsApi = async (blob: Blob): Promise<string> => {
    const X_NLS_TOKEN = '23f3c7ff8cd646d198d24ea6ec41b0f0'
    return new Promise<string>((resolve, reject) => {
      fetch('/asr?appkey=YyCBssRoMTulHOyJ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': blob.size.toString(),
          'X-NLS-Token': X_NLS_TOKEN,
          Host: 'nls-gateway-cn-shanghai.aliyuncs.com',
        },
        body: blob,
      })
        .then((res) => res.json())
        .then(({ result }) => {
          resolve(result)
        })
        .catch((err) => {
          console.log('asr调用出错', err)
          reject(err)
        })
    })
  }
  //文字转语音
  const ttsApi = (
    text: string = '今天星期一，天气很好'
  ): Promise<{
    file: string
    msg: string
    code: 0
  }> => {
    return new Promise((resolve) => {
      fetch(`/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      })
        .then((res) => res.json())
        .then((res: { file: string; msg: string; code: 0 }) => {
          resolve(res)
        })
        .catch((error) => {
          console.error('获取音频失败:', error, text)
          resolve(error)
        })
    })
  }
  return {
    arsApi,
    ttsApi,
  }
}
