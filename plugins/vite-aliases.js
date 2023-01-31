// vite插件必须返回vite一个配置对象, vite中导出的都是一个函数
// 导出函数的目的是提升插件的扩展性能
const fs = require('fs');
const path = require('path');
function diffDirAndFile(dirFilsArr = [], basePath = '') {
    const result = {
        dirs: [],
        files: []
    }
    dirFilsArr.forEach((name) => {
        const currentFileStat = fs.statSync(path.resolve(__dirname, basePath + "/" + name));
        const isDir = currentFileStat.isDirectory();
        if(isDir) {
            result.dirs.push(name) 
        } else {
            result.files.push(name) 
        }
    })
    return result
}
function getTotalDir(keyName) {
    const result = fs.readdirSync(path.resolve(__dirname, "../src"));
    const diffResult = diffDirAndFile(result, '../src');
    const resolveAliasesObj = {}
    // 自己拼接别名对象
    diffResult.dirs.forEach((dirname) => {
        const key = `${keyName}${dirname}`;
        const absPath = path.resolve(__dirname, "../src") + '/' + dirname
        resolveAliasesObj[key] = absPath;
    })
    return resolveAliasesObj;
}
module.exports = ({
    keyName = '@',
} = {}) => {
    return {
        // config参数表示目前的基础config
        // command： serve 或者dev
        // mode： dev 或者prod
        config(config, { command, mode }) {
            const resolveAliasesObj = getTotalDir(keyName);
            return {
                resolve: {
                    alias: resolveAliasesObj,
                  },  
            }
        }
    }
}