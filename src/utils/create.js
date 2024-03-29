import fs from 'fs'
import ejs from 'ejs'
import path from 'path'

const fileHeader = `
/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Auto generated 
import { request } from '../request'

`
/**
 * 创建apiName和url
 * @param urlStr
 * @returns {{apiName: string, url: string}}
 */
const createApiNameAndUrl = (urlStr) => {
  const arr = urlStr.split('/').filter(Boolean)
  const nameArr = arr.map((item, index) => {
    let handleStr = item
    if (/^\{.*\}$/g.test(handleStr)) {
      handleStr = item.replace(/\{(\w+)\}/, (_, match) => 'By' + match.charAt(0).toUpperCase() + match.slice(1))
    }
    if (index !== 0) {
      handleStr = handleStr.charAt(0).toUpperCase() + handleStr.slice(1)
    }
    handleStr = handleStr.replace(/[-_]+([a-z])/g, (_, match) => match.toUpperCase())
    return handleStr
  })
  const urlArr = arr.map((item) => {
    return item.replace(/\{(\w+)\}/, '${params.$1}')
  })
  return {
    apiName: nameArr.join('') + 'Api',
    url: urlArr.join('/')
  }
}
/**
 * 删除apis下所有文件夹
 */
const deleteDirs = (directoryPath) => {
  const items = fs.readdirSync(directoryPath, { withFileTypes: true })
  for (const item of items) {
    const currentPath = path.join(directoryPath, item.name)
    // if (item.isFile()) {
    //   fs.unlinkSync(currentPath)
    // }
    if (item.isDirectory()) {
      fs.rmSync(currentPath, { recursive: true })
    }
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
    const { apiName, url } = createApiNameAndUrl(key)
    const apiOption = {
      apiName,
      url,
      method: optionsArr[0],
      requestType: optionsArr[1] || 'String',
      responseType: optionsArr[2] || 'JSON',
      isAuth: optionsArr[3] === '1'
    }
    const dirName = subPathArr[1]
    const fileName = subPathArr[2]
    if (!obj[dirName]) {
      obj[dirName] = {}
      obj[dirName][fileName] = [apiOption]
    } else {
      if (obj[dirName][fileName]) {
        obj[dirName][fileName].push(apiOption)
      } else {
        obj[dirName][fileName] = [apiOption]
      }
    }
  })
  return obj
}
/**
 * 创建API file
 */
const createApiDirAndFile = (dirPath, fileExt, apiPathObj, templatePath) => {
  const template = fs.readFileSync(path.join(__dirname, templatePath), 'utf-8')
  Object.entries(apiPathObj).forEach(([key, value]) => {
    const folderPath = path.join(dirPath, key)
    fs.mkdirSync(folderPath, { recursive: true })
    Object.entries(value).forEach(([subKey, subValue]) => {
      const fileName = `${subKey}.api${fileExt}`
      const filePath = path.join(folderPath, fileName)
      let content = fileHeader
      for (let i = 0; i < subValue.length; i++) {
        content += ejs.render(template, subValue[i])
      }
      fs.writeFileSync(filePath, content, (err) => {
        if (err) {
          console.error(`Error creating file: ${err.message}`)
        }
      })
    })
  })
}

export const createFile = (options) => {
  const fileExt = options.ts ? '.ts' : '.js'
  const templatePath = options.ts ? './template.ts.ejs' : './template.ejs'
  try {
    // 解析JSON配置文件
    const fileContent = fs.readFileSync(options.configFilePath, 'utf8')
    const jsonObject = JSON.parse(fileContent)
    const apiPathObj = convertApiPathToObject(jsonObject)
    // 删除原有文件夹
    deleteDirs(path.dirname(options.configFilePath))
    // 根据配置文件创建文件夹和文件
    createApiDirAndFile(path.dirname(options.configFilePath), fileExt, apiPathObj, templatePath)
  } catch (e) {
    console.log(`${e}`)
  }
}