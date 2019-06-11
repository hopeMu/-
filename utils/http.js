// 封装微信request请求
// 引入配置项
import { config } from '../config.js'
class HTTP {
    request(params = {}) {
        return new Promise((resolve, reject)=>{
            wx.request({
                url: config.baseURL + params.url,
                method: params.method || 'GET',
                data: params.data || {},
                header: params.header ? Object.asign(config.header, params.header) : config.header,
                success: (res) => {
                    let code = res.statusCode.toString()
                    if (code.startsWith('2') || code === '304') {
                        resolve(res)
                    } else {
                        reject(res)
                        let error_code = res.code
                        this._error(error_code)
                    }
                },
                fail: (err) => {
                    reject()
                    this._error(1)
                }
            })
        })
    }

    // 显示请求错误信息
    _error(error_code) {
        if (!error_code) { error_code = 1 }
        const hint = config.hints[error_code]
        wx.showToast({
            title: hint ? hint : config.hints[1],
            icon: 'none',
            duration: 2000
        })
    }
}

export {
    HTTP
}