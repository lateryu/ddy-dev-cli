#!/usr/bin/env node

const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const tplObjArr = require(`${__dirname}/../template`)
const { spawn } = require('child_process');
const path = require('path')

module.exports = () => {
    if (Array.isArray(tplObjArr)) {
        console.log()
        console.log(chalk.green('可用的模版列表：'))
        console.log()
        tplObjArr.forEach(repo => {
          console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(repo.name) )
        })
      } else {
        console.error("获取失败")
      }
let question = [
 {
    type: 'list',
    name: "name",
    message: "请选择要删除的模板名称",
    choices: tplObjArr,
    }
]

inquirer
 .prompt(question).then( async answers => {
 let { name } = answers;
 const newArr = tplObjArr.filter((item) => item.name !== name);
//  delete tplObj[name]
 // 更新 template.json 文件
 fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(newArr), 'utf-8', err => {
  if (err) console.log(err)
  console.log('\n')
  console.log(chalk.green('Deleted successfully!\n'))
  console.log(chalk.grey('The latest template list is: \n'))
  console.log(newArr)
  console.log('\n')
 })

 const dest = path.resolve(process.cwd());
 console.log(dest, 'dest');


 await spawnCmd(dest, null, 'git', ['pull'])
 await spawnCmd(dest, null, 'git', ['status'])
 await spawnCmd(dest, null, 'git', ['add .'])
 await spawnCmd(dest, null, 'git', [`commit  -m "Initialize by X-BUILD"`])
 await spawnCmd(dest, null, 'git', ['push'])

 function spawnCmd(dest, stdio = 'inherit', cmd, instruction) {
    const ls = spawn(cmd, instruction, {
      cwd: dest,
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
 })}