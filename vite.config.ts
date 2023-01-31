import { defineConfig, loadEnv } from 'vite'
import viteDevConfig from './vite.base.config'
import viteProdConfig from './vite.prod.config'
import viteBaseConfig from './vite.base.config'
const root = process.cwd()
// 基于环境的配置
const envParse = {
  // 
  'build': () => {
    return {
      ...viteBaseConfig,
      ...viteProdConfig,
    }
  },
  'serve': () => {
   return {
    ...viteBaseConfig,
    ...viteDevConfig,
   }
  }
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // loadEnv根据mode获取不同的环境变量mode默认是development/production, 如果不想是这两个后缀可以配置package.json中的命令
  // 最后env会是一个解析后的对象
  // 如果是客户端，vite会将对应的环境变量注入到import.meta.env中
  // 注意env中定义的变量默认是需要以VITE开头否则在import.meta.env中找不到
  // 也可以自定义env的前缀，如下配置
  const env = loadEnv(mode, root)
  return {
    // vite在生产环境对静态资源的处理
    // 当我们在本地面对资源打包完成之后，会提示资源到找不到；这是什么原因呢？
    // GET http://127.0.0.1:5500/assets/index-e8f8a1a0.js net::ERR_ABORTED 404 (Not Found)
    // 这里需要配置一下base: '/'
    base: env.VITE_BASE_URL,
    root: root,
    ...envParse[command](),
    // 默认是以VITE开头的变量才会注入到import.meta.env下
    // envPrefix: 'ENV_',
  }
})
