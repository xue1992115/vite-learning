// mock主要做的事件就是拦截http请求
// 当打给本地请求的时候，由viteserver服务器进行接管
const fs = require('fs');
const path = require('path');
module.exports = (options = {}) => {
    return {
        configureServer(server) {
            // req：请求对象
            // res: 响应对象
            // next： 交给下一个中间件
            server.middlewares.use((req, res, next) => {
                // 自定义请求处理...
                if(req.url === '/api/users') {
                    // 读取根目录下的mock文件
                    const mockStat = fs.statSync('mock')
                    const isDir = mockStat.isDirectory()
                    if(isDir) {
                        // 读取本地的mock/index.js文件内容
                        let children = require(path.resolve(process.cwd(), 'mock/index.js'))[0]
                        const resData = children.response(req)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(resData))
                    }
                } else {
                    next()
                }
            })
        },
    }
}