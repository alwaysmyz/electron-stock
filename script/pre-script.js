const fse = require("fs-extra")
const path = require('path')
const env = process.env.BUILD_ENV || 'development'
const writeEnv = () => {
    fse.copyFileSync(
        path.join(__dirname, `../config/${env}.json`),
        path.join(__dirname,`../config/index.json`)
    )
}
writeEnv()