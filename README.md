# 根据给定模版自动生成api文件

## 文件说明

```
project
├── apis // 存放接口文件
│   ├── paths.json // 接口路径配置文件
│   ├── request.js // 封装的接口请求方法
└── package.json
```

```javascript

// 'url': requestMethod|paramType|responseType|isAuth:[0|1]

// 如果路径中存在变量，则需要在路径中添加变量名，
// 如：`/user/subuser/list/{id}`，同时在调用请求接口时，需要将变量名添加到请求参数中，如：`requestName({id: 1,other: 'xxx'})`

/**
 *   url: '',
 *   method: GET | ...
 *   requestType: 'String' | 'FormData' | 'Blob/File' | 'ArrayBuffer' | ArrayBufferView (Uint8Array等) | URLSearchParams
 *   responseType: 'String' | 'FormData' | 'JSON' | 'ArrayBuffer' | 'Blob'
 *   isAuth: true | flase,
 *   ...
 */
```
### e.g.

```json
{
  "/profile/password/reset/confirm/edit": "GET|String|JSON|0",
  "/profile/detail/{id}/edit": "POST|FormData|String|1",
  "/user/detail/{name}/edit": "POST|FormData|FormData|1",
  "/user/subuser/list": "GET|String|Blob|1",
  "/user/subuser/list/{id}": "GET|String|ArrayBuffer|1",
  "/user/subuser/list/{id}/{name}": "GET|String|JSON|1",
  "/service-user/user/getUserInfo": "GET|String|JSON|1",
  "/service-sso/sso/login": "GET|String|JSON|1",
  "/service-list/sso/login": "GET|String|JSON|1"
}
```



