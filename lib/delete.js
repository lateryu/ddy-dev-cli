#!/usr/bin/env node

const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const tplObjArr = require(`${__dirname}/../template`)

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
 .prompt(question).then(answers => {
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
 })}