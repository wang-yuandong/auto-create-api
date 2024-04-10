import chokidar from 'chokidar'
import { create } from './utils/create.js'
import path from 'path'

export default (options = {}) => {
  const defaultOptions = {
    folderPath: 'apis',
    pathsFileName: 'paths.json',
    ts: false,
    log: false
  }
  const mergedOptions = { ...defaultOptions, ...options }
  const configFilePath = path.join(process.cwd(), 'src', mergedOptions.folderPath, mergedOptions.pathsFileName)
  return {
    name: 'create-apis',

    // 在构建开始前初始化插件
    buildStart() {
      const watcher = chokidar.watch(configFilePath || '.', {
        ignored: /node_modules/, // 忽略不需要监听的目录
        persistent: true,
        ignoreInitial: true // 忽略初始化时的文件变动事件
      })

      // 监听文件变化事件
      watcher.on('change', (filePath) => {
        // console.log(`----------------------------------File ${filePath} has been changed, triggering rebuild...`)
        create({ ...mergedOptions, configFilePath })
      })

      // 清理资源，在插件卸载时关闭文件监听器
      return () => watcher.close()
    }
  }
}
