// vite插件必须返回vite一个配置对象, vite中导出的都是一个函数
// 导出函数的目的是提升插件的扩展性能

module.exports = (options = {}) => {
    return {
        // transformIndexHtml是转换html的专用的钩子
        // 该钩子接收当前的HTML字符串和转换上下文
        transformIndexHtml: {
            // enforce主要是调整插件的执行顺序
            enforce: 'pre',
            transform: (html, ctx) => {
                return html.replace(/<%= title %>/g, options.inject.data.title)
            } 
        }
    }
}