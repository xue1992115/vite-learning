/*
 * @Author: 刘彦宏
 * @Date: 2022-10-10 15:49:44
 * @LastEditors: 刘彦宏
 * @LastEditTime: 2022-10-11 14:35:20
 * @Description: file content
 */
/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

