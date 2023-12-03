# 根据给定模版自动生成api文件

## 文件说明
- apis
  - create.js 主要执行文件
  - paths.config.js 接口路径配置文件
  - template.ejs 模版文件--生成js
  - template.ts.ejs 模版文件--生成ts
  - request.js 封装的接口请求方法 `export const request = ...`

## paths.config.js格式
```javascript
// '接口路径':'请求方法|请求参数类型(缺醒值为String)|返回参数类型(JSON)|是否需要token(需要为1，不需要为0)'
// url : method|requestBodyType(deafault type : String)|responseBodyType(deafault type : JSON)|needToken(1|0,default 1)'
// 如果路径中存在变量，则需要在路径中添加变量名，
// 如：`/user/subuser/list/{id}`，同时在调用请求接口时，需要将变量名添加到请求参数中，如：`requestName({id: 1,other: 'xxx'})`
// e.g.

/**
 *   url: '',
 *   method: 'GET' | 'POST'
 *   requestBodyType: 'String' | 'FormData' | 'Blob/File' | 'ArrayBuffer' | ArrayBufferView (Uint8Array等) | URLSearchParams
 *   responseBodyType: 'String' | 'FormData' | 'JSON' | 'ArrayBuffer' | 'Blob'
 *   needToken: '1'|'0',
 *   ...
 */
export const paths = {
'/profile/password/reset/confirm/edit': 'GET|String|JSON|0',
'/profile/detail/{id}/edit': 'POST|FormData|String|1',
'/user/detail/{name}/edit': 'POST|FormData|FormData|1',
'/user/subuser/list': 'GET|String|Blob|1',
'/user/subuser/list/{id}': 'GET|String|ArrayBuffer|1',
'/user/subuser/list/{id}/{name}': 'GET|String|JSON|1',
'/airservice-user/user/getUserInfo': 'GET|String|JSON|1',
}
```

## 运行

```bash
# 生成ts文件
node apis/create.js --ts
# 生成js文件
node apis/create.js
# or 
# "createApi": "node apis/create.js",
pnpm createApi --ts
```

