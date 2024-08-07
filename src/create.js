import fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

let dirname = null
try {
  dirname = __dirname
} catch (e) {
  dirname = path.dirname(fileURLToPath(import.meta.url))
}
const fileHeader = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Auto generated By auto-create-api,Do not modify this file directly.

import { request } from '../request'

`
/**
 * 解析API基础信息
 * @param urlStr
 * @returns {{}} || {}
 */
const createApiBaseInfo = (urlStr) => {
  // 获取url信息
  const infos = urlStr.split('|')
  // 如果只有一个元素，则返回空对象
  if (infos.length === 1) {
    return {}
  }
  const method = infos[0].toLowerCase()
  const arr = infos[1].split('/').filter(Boolean)
  // 处理url
  const nameArr = arr.map((item, index) => {
    let handleStr = item
    // 如果是参数，则替换为By开头
    if (/^\{.*\}$/g.test(handleStr)) {
      handleStr = item.replace(/\{(\w+)\}/, (_, match) => 'By' + match.charAt(0).toUpperCase() + match.slice(1))
    }
    // 首字母大写
    handleStr = handleStr.charAt(0).toUpperCase() + handleStr.slice(1)
    // 驼峰命名
    handleStr = handleStr.replace(/[-_]+([a-z])/g, (_, match) => match.toUpperCase())
    return handleStr
  })
  // 拼接url
  const urlArr = arr.map((item) => {
    return item.replace(/\{(\w+)\}/, '${params.$1}')
  })
  return {
    apiName: `${method}${nameArr.join('')}`,
    url: `/${urlArr.join('/')}`,
    method
  }
}

/**
 * 转换api路径为对象
 */
const convertApiPathToObject = (apiPathsJSON) => {
  const obj = {}
  Object.entries(apiPathsJSON).forEach(([key, value]) => {
    const subPathArr = key.split('/')
    const optionsArr = value.split('|')
    const { apiName, url, method } = createApiBaseInfo(key)
    if (!apiName || !url || !method) {
      return
    }
    const apiOption = {
      apiName,
      url,
      method,
      requestType: optionsArr[0] || 'String',
      responseType: optionsArr[1] || 'JSON',
      isAuth: optionsArr[2] === '1'
    }
    const dirName = subPathArr[1]
    const fileName = subPathArr[2] || dirName
    if (!obj[dirName]) {
      obj[dirName] = {}
      obj[dirName][fileName] = [apiOption]
    } else {
      if (obj[dirName][fileName]) {
        // 根据apiOption中apiName查找，如果不存在则push
        if (!obj[dirName][fileName].find((item) => item.apiName === apiOption.apiName)) {
          obj[dirName][fileName].push(apiOption)
        }
      } else {
        obj[dirName][fileName] = [apiOption]
      }
    }
  })
  return obj
}
/**
 * diff创建
 * @param dirPath
 * @param fileExt
 * @param apiPathObj
 * @param templatePath
 */
const createApiFile = (dirPath, fileExt, apiPathObj, templatePath) => {
  // 获取原始目录及文件数组
  const oldDirs = fs.readdirSync(dirPath, { withFileTypes: true }).filter((item) => item.isDirectory())
  // 获取每个文件夹下的文件并合并为数组
  const oldFiles = oldDirs.map((item) => fs.readdirSync(path.join(item.path, item.name), { withFileTypes: true })).flat()
  oldFiles.forEach((item) => {
    // 删除非文件
    if (item.isDirectory()) {
      fs.rmSync(path.join(item.path, item.name), { recursive: true })
    }
    item['fullPath'] = path.join(item.path, item.name)
    item['diffStatus'] = null
  })
  const oldDirNames = oldDirs.map((item) => item.name)
  const newDirNames = Object.keys(apiPathObj)
  // 过滤掉相同的文件夹
  const filterNewDirNames = newDirNames.filter((item) => !oldDirNames.includes(item))
  const filterOldDirNames = oldDirNames.filter((item) => !newDirNames.includes(item))
  // 删除旧的文件夹
  for (const item of filterOldDirNames) {
    const currentPath = path.join(dirPath, item)
    fs.rmSync(currentPath, { recursive: true })
  }
  // 创建新的目录
  for (const item of filterNewDirNames) {
    const currentPath = path.join(dirPath, item)
    fs.mkdirSync(currentPath)
  }
  // 解析模板信息
  const template = fs.readFileSync(path.join(dirname, '../templates', templatePath), 'utf-8')

  Object.entries(apiPathObj).forEach(([key, value]) => {
    const folderPath = path.join(dirPath, key)
    Object.entries(value).forEach(([subKey, subValue]) => {
      const fileName = `${subKey}.api${fileExt}`
      const filePath = path.join(folderPath, fileName)
      // 查找对应路路径的文件，如果没有则直接创建，有则比对后决定是否创建
      if (fs.existsSync(filePath)) {
        const oldContent = fs.readFileSync(filePath, 'utf8')
        let content = fileHeader
        for (let i = 0; i < subValue.length; i++) {
          content += ejs.render(template, subValue[i])
        }
        if (oldContent !== content) {
          fs.writeFileSync(filePath, content)
        }
      } else {
        let content = fileHeader
        for (let i = 0; i < subValue.length; i++) {
          content += ejs.render(template, subValue[i])
        }
        fs.writeFileSync(filePath, content)
      }
      // 将已创建的文件在原始文件列表中打上标记，以便后续删除无标记文件
      oldFiles.forEach((item) => {
        if (item.fullPath === filePath) {
          item.diffStatus = 'done'
        }
      })
    })
  })

  oldFiles.forEach((item) => {
    if (!item.diffStatus && fs.existsSync(item.fullPath)) {
      fs.unlinkSync(item.fullPath)
    }
  })
}
/**
 * 插件主方法
 * @param options
 * @returns {Promise<void>}
 */
export const create = async (options) => {
  if (options.log) {
    console.time('auto-create-api')
  }
  const fileExt = options.ts ? '.ts' : '.js'
  const templatePath = options.ts ? './template.ts.ejs' : './template.ejs'
  try {
    // 解析JSON配置文件
    const fileContent = fs.readFileSync(options.configFilePath, 'utf8')
    const jsonObject = JSON.parse(fileContent)
    const apiPathObj = convertApiPathToObject(jsonObject)
    createApiFile(path.dirname(options.configFilePath), fileExt, apiPathObj, templatePath)
    if (options.log) {
      console.timeEnd('auto-create-api')
      console.log('auto-create-api : success!')
    }
  } catch (e) {
    if (options.log) {
      console.error(`auto-create-api : ${e}`)
    }
  }
}
