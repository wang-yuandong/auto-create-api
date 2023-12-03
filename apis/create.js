import fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import {apiPaths} from "./paths.config.js";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const createOptions = process.argv.slice(2)
const tsFlag = createOptions.some(item => item.startsWith("--") && item.endsWith("ts"));
const fileExt = tsFlag ? '.ts' : '.js'
const templatePath = tsFlag ? path.join(__dirname, './template.ts.ejs') : path.join(__dirname, './template.ejs')
const fileHeader = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Auto generated 
import { request } from '../request'

`
/**
 * 创建代码
 * @param apiOption
 * @returns {*}
 */
const createCodeFromTemplate = (apiOption) => {
    const template = fs.readFileSync(templatePath, 'utf-8');
    return ejs.render(template, apiOption);
}
/**
 * 创建apiName和url
 * @param key
 * @returns {{apiName: string, url: string}}
 */
const createApiNameAndUrl = (key) => {
    const arr = key.split('/').filter(Boolean);
    const nameArr = arr.map((item, index) => {
        let handleStr = item;
        if (/^\{.*\}$/g.test(handleStr)) {
            handleStr = item.replace(/\{(\w+)\}/, (_, match) => 'By' + match.charAt(0).toUpperCase() + match.slice(1));
        }
        if (index !== 0) {
            handleStr = handleStr.charAt(0).toUpperCase() + handleStr.slice(1);
        }
        handleStr = handleStr.replace(/[-_]+([a-z])/g, (_, match) => match.toUpperCase());
        return handleStr
    });
    const urlArr = arr.map((item) => {
        return item.replace(/\{(\w+)\}/, '${params.$1}');
    })
    return {
        apiName: nameArr.join('') + 'Api',
        url: urlArr.join('/')
    }
}
/**
 * 判断文件夹是否存在，存在则删除重新创建
 */
const deleteAndCreateDir = (dir) => {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {recursive: true});
    }
    fs.mkdirSync(dir);
}
/**
 * 转换api路径为对象
 */
const convertApiPathToObject = (apiPaths) => {
    const obj = {}
    Object.entries(apiPaths).forEach(([key, value]) => {
        const subPathArr = key.split('/');
        const optionsArr = value.split('|');
        const {apiName, url} = createApiNameAndUrl(key);
        const apiOption = {
            apiName,
            url,
            method: optionsArr[0],
            requestBodyType: optionsArr[1] || 'String',
            responseBodyType: optionsArr[2] || 'JSON',
            needToken: optionsArr[3] === '1',
        }
        const dirName = subPathArr[1];
        const fileName = subPathArr[2];
        if (!obj[dirName]) {
            obj[dirName] = {}
            obj[dirName][fileName] = [apiOption];
        } else {
            if (obj[dirName][fileName]) {
                obj[dirName][fileName].push(apiOption);
            } else {
                obj[dirName][fileName] = [apiOption];
            }
        }
    });
    return obj
}
/**
 * 创建API file
 */
const createApiFile = (apiPathObj) => {
    Object.entries(apiPathObj).forEach(([key, value]) => {
        const folderPath = `${__dirname}/${key}`;
        deleteAndCreateDir(folderPath);
        Object.entries(value).forEach(([subKey, subValue]) => {
            const fileName = `${subKey}.api${fileExt}`;
            const filePath = path.join(folderPath, fileName);
            let content = fileHeader;
            for (let i = 0; i < subValue.length; i++) {
                content += createCodeFromTemplate(subValue[i]);
            }
            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    console.error(`Error creating file: ${err.message}`);
                }
            })
        })
    })
}

createApiFile(convertApiPathToObject(apiPaths));
