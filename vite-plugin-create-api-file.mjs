import chokidar from 'chokidar'

const createApiFilePlugin = (options) => {

    return {
        name: 'vite-plugin-create-api-file',
        transform(src, id) {
            // console.log(12312)
            // console.log(src,id)
        },
        configureServer(server) {
            // const watcher = chokidar.watch('src/apis')
            // const watchFileChange = (filePath) => {
            //     if (filePath.endsWith('paths.config.mjs')) {
            //         console.log(`File ${filePath} has been changed`)
            //         createApiFile(convertApiPathToObject(apiPaths))
            //     }
            //     watcher.off('change', watchFileChange);
            // }
            // watcher.on('change', watchFileChange)
        }
    }
}

export {createApiFilePlugin}
