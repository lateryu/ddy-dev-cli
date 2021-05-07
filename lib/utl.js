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