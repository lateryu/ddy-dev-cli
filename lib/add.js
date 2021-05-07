// 交互式命令行
const inquirer = require('inquirer')
// 修改控制台字符串的样式
const chalk = require('chalk')
// node 内置文件模块
const fs = require('fs')
const path = require('path');
// 读取根目录下的 template.json
let tplObjArr = require(`${__dirname}/../template`)
const { spawn } = require('child_process');
console.log(tplObjArr, '111');

// 自定义交互式命令行的问题及简单的校验
module.exports = async () => {
let question = [
 {
    name: "name",
    type: 'input',
    message: "请输入模板名称",
    validate (val) {
        if (val === '') {
            return 'Name is required!'
        } else if (tplObjArr.some((item) => item.name === val)) {
            return 'Template has already existed!'
        } else {
            return true
        }
    }
 }, {
    name: "url",
    type: 'input',
    message: "请输入模板地址",
    validate (val) {
    if (val === '') return 'The url is required!'
    return true
    }, 
 }, {
    name: "branch",
    type: 'input',
    message: "请输入分支名",
    validate (val) {
    if (val === '') return 'The url is required!'
    return true
    }
}]

inquirer
 .prompt(question).then( async answers => {
    console.log(answers, '222');
 // answers 就是用户输入的内容，是个对象
 let { name, url, branch } = answers;
 // 过滤 unicode 字符
 const tplObj = { };
 tplObj.name = name;
 tplObj.url =  url.replace(/[\u0000-\u0019]/g, '');
 tplObj.branch = branch;
 tplObjArr.push(tplObj);

 // 把模板信息写入 template.json 文件中
 fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(tplObjArr), 'utf-8', err => {
  if (err) console.log(err)
  console.log('\n')
  console.log(chalk.green('Added successfully!\n'))
  console.log(chalk.grey('The latest template list is: \n'))
  console.log(tplObjArr)
  console.log('\n')
 })
 const dest = path.resolve(process.cwd(), 'template');
 console.log(dest, 'dest');


 await spawnCmd(dest, null, 'git', ['status'])
 await spawnCmd(dest, null, 'git', ['add .'])
 await spawnCmd(dest, null, 'git', [`commit -m "Initialize by X-BUILD"`])
//  await spawnCmd(dest, null, 'git', ['push'])

 function spawnCmd(dest, stdio = 'inherit', cmd, instruction) {
    const ls = spawn(cmd, instruction, {
      cwd: __dirname,
      stdio: stdio,
      shell: true
    });
    return new Promise((resolve, reject) => {
      ls.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject();
        }
      });
    })
}

 })

}

/**
 * 安装依赖指令
 * @param {string} dest 需要执行指令的路径
 */
 // function spawnCmd(dest, stdio = 'inherit', cmd, instruction) {
//     const ls = spawn(cmd, instruction, {
//       cwd: __dirname,
//       stdio: stdio,
//       shell: true
//     });
//     return new Promise((resolve, reject) => {
//       ls.on('close', (code) => {
//         if (code === 0) {
//           resolve()
//         } else {
//           reject();
//         }
//       });
//     })
// }