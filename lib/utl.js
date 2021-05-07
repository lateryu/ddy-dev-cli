import compareVersions from 'compare-versions';

import { getJSON } from '@alipay/kobe-util'


async function  checkVersion(name, version) {
    const pkgUrl = `http://registry.npm.alibababa-icv.com/${name}/${version}`;
    const { version: newVersion } = await getJSON({url:pkgUrl});
    const curVersion = process.env.VERSION_CURRENT[name];
    if(compareVersions(curVersion, newVersion) < 0) {
        console.warn(`${name}: 最新版本${newVersion}, 当前版本: ${curVersion}`)
    }
}

const { modules } = kobe.config.version
modules.forEach(({name, varsion}) => checkVersion(name, version))

// 获取 JSON 数据
export function getJSON({ url, param = {}, timeout = 20000 }) {
    const jsonUrl = encodeUrl(url, param)
  
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
  
      // 加载完成
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const json = JSON.parse(xhr.responseText)
            resolve(json)
          } catch (e) {
            const err = new Error('解码失败')
            err.error = 14
            reject(err)
          }
        } else {
          const err = new Error('HTTP 错误')
          err.error = 19
          reject(err)
        }
      })
  
      // 网络出错
      xhr.addEventListener('error', () => {
        const err = new Error('网络出错')
        err.error = 10
        reject(err)
      })
  
      // 超时时间设置
      xhr.timeout = timeout
      // 超时错误
      xhr.addEventListener('timeout', () => {
        const err = new Error('超时')
        err.error = 13
        reject(err)
      })
  
      xhr.open('GET', jsonUrl, true)
      xhr.send()
    })
  }