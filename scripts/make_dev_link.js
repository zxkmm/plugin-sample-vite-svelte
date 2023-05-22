import fs from 'fs';


//************************************ Write you dir here ************************************

//Please write the "workspace/data/plugins" directory here
//请在这里填写你的 "workspace/data/plugins" 目录
const targetDir = '';
//Like this
// const targetDir = `H:\\SiYuanDevSpace\\data\\plugins`;
//********************************************************************************************


async function getSiYuanDir() {
    let url = 'http://127.0.0.1:6806/api/system/getConf';
    let header = {
        // "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
    }
    try {
        let conf = await fetch(url, {
            method: 'POST',
            headers: header
        });
        console.log(conf);
    } catch (e) {
        console.log('Failed! Please make sure SiYuan is running');
        process.exit(1);
    }
}

if (targetDir === '') {
    await getSiYuanDir();
    process.exit(0);
}

//Check
if (!fs.existsSync(targetDir)) {
    console.log(`Failed! plugin directory not exists: "${targetDir}"`);
    console.log(`Please set the plugin directory in scripts/make_dev_link.js`);
    process.exit(1);
}


//check if plugin.json exists
if (!fs.existsSync('./plugin.json')) {
    console.error('Failed! plugin.json not found');
    process.exit(1);
}

//load plugin.json
const plugin = JSON.parse(fs.readFileSync('./plugin.json', 'utf8'));
const name = plugin?.name;
if (!name || name === '') {
    console.log('Failed! Please set plugin name in plugin.json');
    process.exit(1);
}

//dev directory
const devDir = `./dev`;
//mkdir if not exists
if (!fs.existsSync(devDir)) {
    fs.mkdirSync(devDir);
}

const targetPath = `${targetDir}/${name}`;
//如果已经存在，就退出
if (fs.existsSync(targetPath)) {
    console.log('Failed! Target directory already exists');
    process.exit(1);
}

//创建软链接
fs.symlinkSync(`${process.cwd()}/dev`, targetPath, 'junction');
console.log(`Done! Created symlink ${targetPath}`);
