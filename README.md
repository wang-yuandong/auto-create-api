# 根据给定模版自动生成api文件

## 文件说明

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
## use case
### before create

```
src
├── apis // 存放接口文件
│   ├── paths.json // 接口路径配置文件
│   ├── request.js // 封装的接口请求方法 默认与paths.json同级目录，文件名为request，暂不支持修改
...
```
### after create
```
src
├── apis // 存放接口文件
│   ├── user // 根据url第一段路径生成
│       └── subuser.api.js // 根据url第二段路径命名
│   ├── profile 
│       └── detail.api.js
│   ├── paths.json // 接口路径配置文件
│   ├── request.js // 封装的接口请求方法 默认与paths.json同级目录，文件名为request，暂不支持修改
...
```
### paths.json
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
### options
```javascript
{
    folderPath: 'apis', // 生成的文件父级目录 default value is 'apis'
    pathsFileName: 'paths.json', // 接口路径配置文件名称 default value is 'paths.json'
    ts: false // 是否生成ts文件 default value is false
}
```
### rollup or vite
```javascript
import autoCreateApi from 'auto-create-api/rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...
    autoCreateApi(), 
    // ...
  ],
})

```


