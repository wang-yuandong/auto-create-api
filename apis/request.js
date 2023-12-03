export const createFormData = (param) => {
    const formData = new FormData()
    for (const key in param) {
        formData.append(key, param[key])
    }
    return formData
}

export const ACCESS_TOKEN = 'access_token'

/**
 * 封装--window.fetch
 * @param param: {
 *   url: '',
 *   method: 'POST',// 'GET' | 'POST' | 'PUT'
 *   data: {},
 *   requestBodyType: 'String',// String | FormData | Blob/File | ArrayBuffer | ArrayBufferView (Uint8Array等) | URLSearchParams
 *   responseBodyType: 'JSON',// String | FormData | JSON | ArrayBuffer | Blob
 *   needToken: Boolean,
 *   ...
 * }
 * @returns {Promise<Response>}
 */
const defaultParam = {
    method: 'GET',
    mode: 'cors',
    data: {},
    requestBodyType: 'String',
    responseBodyType: 'JSON',
    needToken: true,
}
export const request = async (param) => {
    const paramAfterAssign = {...defaultParam, ...param}
    const headers = Object.assign(
        {},
        paramAfterAssign['requestBodyType'] === 'String'
            ? {'Content-Type': 'application/json'}
            : null,
        paramAfterAssign['needToken'] ? {Authorization: `Bearer ${localStorage.get('ACCESS_TOKEN')}`} : null
    )
    /*
    fetch param demo

    init:{
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }
     */
    const init = {
        method: paramAfterAssign['method'],
        headers,
        credentials: 'include' // 包含Cookie
    }

    let url = paramAfterAssign['url']

    if (paramAfterAssign['method'] === 'POST') {
        // 如果是post格式- 合并请求
        if (paramAfterAssign['requestBodyType'] === 'String') {
            Object.assign(init, {body: JSON.stringify(paramAfterAssign['data'])})
        }
        if (paramAfterAssign['requestBodyType'] === 'FormData') {
            Object.assign(init, {body: createFormData(paramAfterAssign['data'])})
        }
    }
    if (paramAfterAssign['method'] === 'GET') {
        // 判断是get请求的话修改请求参数
        const params = paramAfterAssign['data'] || {}
        const paramsArray = []
        // 拼接参数
        Object.keys(params).forEach((key) => paramsArray.push(key + '=' + params[key]))
        if (paramsArray.length > 0) {
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
    }
    const compatibleFetch = window.fetch // 可以在这对fetch进行兼容
    try {
        const result = await compatibleFetch(url, init)
        if (200 !== result.status) {
            return {
                status: result.status,
                code: 'NET_ERROR',
                msg: `网络错误！${result.status}`
            }
        }
        if ('String' === paramAfterAssign['responseBodyType']) {
            return result.text()
        }
        if ('ArrayBuffer' === paramAfterAssign['responseBodyType']) {
            return result.arrayBuffer()
        }
        if ('Blob' === paramAfterAssign['responseBodyType']) {
            return result.blob()
        }
        if ('FormData' === paramAfterAssign['responseBodyType']) {
            return result.formData()
        }
        if ('JSON' === paramAfterAssign['responseBodyType']) {
            return result.json()
        }
    } catch (e) {
        return e
    }
}
