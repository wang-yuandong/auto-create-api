/*
 * path自动生成格式
 * '接口路径' : '请求方法|请求参数类型|返回参数类型|是否需要token(需要为1，不需要为0)'
 * 大小写敏感，可以先定义枚举，防止打错
 * 若服务端接口路径中包含{id}，则在入参名称中添加{id}
 * e.g.
 * '/profile/detail/{id}/edit' 则 param格式为{id:xxxx}，至少包含一个名称为id的key
 */

/**
 * requestByFetch({
 *   url: '',
 *   method: 'POST',// 'GET' | 'POST' | 'PUT'
 *   data: {},
 *   requestBodyType: 'String',// String | FormData | Blob/File | ArrayBuffer | ArrayBufferView (Uint8Array等) | URLSearchParams
 *   responseBodyType: 'JSON',// String | FormData | JSON | ArrayBuffer | Blob
 *   needToken: Boolean,
 *   ...
 * })
 */

export const apiPaths = {
    '/profile/password/reset/confirm/edit': 'GET|String|JSON|0',
    '/profile/detail/{id}/edit': 'POST|FormData|String|1',
    '/user/detail/{name}/edit': 'POST|FormData|FormData|1',
    '/user/subuser/list': 'GET|String|Blob|1',
    '/user/subuser/list/{id}': 'GET|String|ArrayBuffer|1',
    '/user/subuser/list/{id}/{name}': 'GET|String|JSON|1',
    '/service-user/user/getUserInfo': 'GET|String|JSON|1',
    '/service-sso/sso/login': 'GET|String|JSON|1',
    '/service-list/sso/login': 'GET|',
}
