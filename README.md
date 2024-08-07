# 根据给定模版自动生成api文件

## Install

```bash
npm install auto-create-api -D
```

## Example

### path config file（paths.config）

```javascript
// 'method|url': requestType|responseType|isAuth:[0|1]
// 如："get|/profile/password/reset/confirm/edit": "String|JSON|0"

// 如果路径中存在变量，则需要在入参中添加变量名，
// 如：`/user/subuser/list/{id}`，同时在调用请求接口时，需要将变量名添加到请求参数中
// 如：`requestName({id: 1,other: 'xxx'})`
```
### paths.json

```json
{
  "get|/profile/password/reset/confirm/edit": "String|JSON|0",
  "get|/profile/detail/{id}/edit": "FormData|String|1",
  "get|/user/detail/{name}/edit": "FormData|FormData|1",
  "get|/user/subuser/list": "String|Blob|1",
  "get|/user/subuser/list/{id}": "String|ArrayBuffer|1",
  "post|/user/subuser/list/{id}/{name}": "String|JSON|1",
  "post|/service-user/user/getUserInfo": "String|JSON|1",
  "post|/service-sso/sso/login": "String|JSON|1",
  "post|/service-sso": "String|JSON|1",
  "get|/service-sso": "String|JSON|1",
  "post|/service-sso/sso": "String|JSON|1",
  "post|/service-list/sso/login": "String|JSON|1"
}
```

### Vite

```javascript
// vite.config.js
import autoCreateApi from 'auto-create-api/rollup'

export default defineConfig({
  plugins: [
    // ...
    autoCreateApi({/* options */}), 
    // ...
  ],
})
```

### Rollup

```javascript
// rollup.config.js
import autoCreateApi from 'auto-create-api/rollup'

export default defineConfig({
  plugins: [
    // ...
    autoCreateApi({/* options */}), 
    // ...
  ],
})
```

## Configuration

### plugin

```javascript
autoCreateApi({
  // 生成的文件父级目录 
  folderPath: 'apis',
  // 接口路径配置文件名称，在folderPath下
  pathsFileName: 'paths.json',
  // 是否生成ts文件
  ts: false,
  // 是否输出日志
  log:false 
})
```

## Result

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



