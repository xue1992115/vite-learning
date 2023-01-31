// 具体参考mockjs官网https://github.com/nuysoft/Mock/wiki/Syntax-Specification#2-%E5%B1%9E%E6%80%A7%E5%80%BC%E6%98%AF%E6%95%B0%E5%AD%97-number
const  mockJS = require('mockjs') ;
// 使用mockjs去模拟数据
const useList = mockJS.mock({
    // "data|100"表示生成data中有100条数据
    "data|100":[{
        name: '@cname', // 表示不同的中文名
        enname: '@name', // 表示不同的英文名
        "id|+1": 1, // id是自增1
        avater: mockJS.Random.image()
    }]  
})
module.exports = [
    {
        method: 'post',
        url: '/api/users',
        // body： 请求体 包含pageSize...
        response: ({ body }) => {
            return {
                code:  200,
                msg: 'success',
                ...useList,
            }
        }
    }
]