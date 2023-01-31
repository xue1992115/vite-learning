import { defineConfig } from 'vite'
import  postcssPresetEnv from 'postcss-preset-env'
import vue from '@vitejs/plugin-vue'
// import { ViteAliases } from 'vite-aliases'
import MyViteAliases from './plugins/vite-aliases'
// import { createHtmlPlugin } from 'vite-plugin-html'
import MyCreateHtml from './plugins/create-html'
// import { viteMockServe } from 'vite-plugin-mock'
import MyMock from './plugins/mock-plugin'
// 和ts结合，用于强类型锁定
import checker from 'vite-plugin-checker'
// 增强版的压缩使用
import viteCompression from 'vite-plugin-compression';
const path = require('path');
export default defineConfig({
  optimizeDeps: {
    exclude: []
  },
  css: {
    // 整个配置最后会传递给postcss-modules
    // 注意该配置项是针对的css modules,应该是以.modules.css结尾的文件才起作用
    modules: {
      // 定义转换成的css命名规范camelCase｜camelCaseOnly｜dashes | dashesOnly
      localsConvention: 'camelCaseOnly',
      // 是否开启模块化，global关闭 local开启
      scopeBehaviour: 'local',
      generateScopedName: '[name]_[local]_[hash: 2]', // https://github.com/madyankin/postcss-modules
      hashPrefix: 'test', //会根据类名和 + 一些其他的字符串 随机生成的
      // globalModulePaths?: RegExp[] // 有些moduel不希望参与模块化，
    },
    // css的预处理器的配置
    // 预处理器就是
    preprocessorOptions: {
      // 整个配置最终会给到less的执行参数中去
      // 具体的可以参考less的官方文档https://less.bootcss.com/usage/#lessjs-options-math
      less: {
        math: 'always',
        // 定义全局的变量，解决频繁import的问题
        globalVar: {
          mainColor: 'red'
        }
      }
    },
    // 开启sourceMap, 方便错误定位
    devSourcemap: true,
    // postcss主要做的工作：（1）处理不同的浏览器的兼容，（2）增加前缀
    postcss: {
      plugins: [postcssPresetEnv()]
    }
  },
  // vite加载静态资源，什么是前端的静态资源？
  // 对于前端来说就是存在本地的图片、视频、音频、字体资源这些，对于后端来说的话就是除了动态的接口，其他的都是静态资源
  // vite对静态资源是开箱即用的，对svg也是开箱即用的
  // 别名处理，别名处理的原理node在读取vite.config.js文件的时会做路径处理，具体的可以看源码
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //     "@assets": path.resolve(__dirname, "./src/assets"),
  //     "@components": path.resolve(__dirname, "./src/components"),
  //   }
  // },
  // 打包后的资源为什么会有hash？浏览器会有一个缓存机制，只要静态资源的命名没有变更，那么就会使用缓存资源
  build: {
    // 代码压缩
    minify: true,
    // 配置rollup的一些配置策略，这个可以参考rollup的官方文档
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './index.html'),
        product: path.resolve(__dirname, './src/product.html')
      },
      // output控制输出资源
      output: {
        // assetFileNames指的是静态资源的，像图片，js文件的命名是不起作用的
        assetFileNames: "[name].[hash].[ext]",
        manualChunks: (id: string) => {
          if(id.includes("node_modules")) {
            return 'vendor'
          }
        }
      }
    },
    // 输出资源的路径,默认的目录是dist
    outDir: 'dist',
    // 静态资源小于4KB的转成base64
    assetsInlineLimit: 4096, // 4KB
    // 静态资源的文件目录
    assetsDir: 'static',
    // 每次build之前清空之前的build的资源，默认是true
    emptyOutDir: true,
  },
  // 插件是什么？
  // 插件就是允许vite在不同的生命周期（不同的钩子函数）调用不同的插件，进行处理，以达到不同的目的
  // 官方提供的插件https://github.com/vitejs/awesome-vite#plugins
  // 学习一些常用的插件
  plugins: [
    vue(),
    viteCompression(),
    // vite-aliases是帮助我们自动的生成别名的，检测你当前的目录包括src在内的所有的文件目录，帮助我们自动生成别名
    // 等同于resolve中的alias
    // 有一个bug,就是这个ViteAliases的插件使用必须在package.json中配置type：‘module' 也就是设置解析的模块是esm
    // 这就导致没有办法使用require导入语句  (Plugin is only available for ESM)
    // ViteAliases(),
    // 手写一个ViteAliases的插件
    // 基本原理就是：首先我们要生成一个resolve中的配置，那么执行的时机就应该在
    // vite执行配置文件之前进行去改写配置文件
    MyViteAliases(),
    // createHtmlPlugin({
    //   // inject就是注入data,使用的ejs的语法 <%= title %>
    //   // 这里需要将html中的title变成ejs的语法 <title><%= title %></title>
    //   // 这时候会展示title为   主页
    //   inject: {
    //     data: {
    //       title: '主页',
    //       // injectScript: `<script src="./inject.js"></script>`,
    //     }
    //   }
    // })
    MyCreateHtml({
      inject: {
        data: {
          title: '测试'
        }
      }
    }),
    // vite-plugin-mock 用来mock数据的
    // 之前常用的mock数据的方式：就是直接写死数据
    // 缺点：没有办法生成海量的数据；没有办法获取标准的数据； 没有办法感知接口请求异常情况
    // 大型的项目中可以使用mockjs去模拟数据，而vite-plugin-mock的依赖项就是mockjs，因此需要安装两个
    // 插件 vite-plugin-mock和mockjs
    // 这个插件是开箱即用的， 会默认找根目录下的mock文件
    // viteMockServe({
    //   // 指定mock数据的路径，默认的也是下边的这个路径
    //   mockPath: 'mock',
    // }),
    MyMock(),
    checker({
      typescript: true
    })
  ]
})