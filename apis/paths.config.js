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
