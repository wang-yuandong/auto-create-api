import fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import {apiPaths} from "./paths.js";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileHeader = `// 此文件自动生成 无需修改
import { requestByFetch } from '../request-by-fetch.js'

`
const createCodeFromTemplate = (apiOption) => {
    const template = fs.readFileSync(path.join(__dirname, './template.ejs'), 'utf-8');
    return ejs.render(template, apiOption);
}
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
    })
    const urlArr = arr.map((item) => {
        return item.replace(/\{(\w+)\}/, '${params.$1}');
    })
    return {
        apiName: nameArr.join(''),
        url: urlArr.join('/')
    }
}
const obj = {}
Object.entries(paths).forEach(([key, value]) => {
    const subPathArr = key.split('/');
    const optionsArr = value.split('|');
    const {apiName, url} = createApiNameAndUrl(key);
    const apiOption = {
        apiName,
        url,
        method: optionsArr[0],
        requestBodyType: optionsArr[1],
        responseBodyType: optionsArr[2],
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
Object.entries(obj).forEach(([key, value]) => {
    const folderPath = `${__dirname}/${key}`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    Object.entries(value).forEach(([subKey, subValue]) => {
        const fileName = `${subKey}.js`;
        const filePath = path.join(folderPath, fileName);
        let content = fileHeader;
        for (let i = 0; i < subValue.length; i++) {
            content += createCodeFromTemplate(subValue[i]);
        }
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error(`Error creating file: ${err.message}`);
            } else {
                console.log(`File "${filePath}" created successfully.`);
            }
        })
    })
})
