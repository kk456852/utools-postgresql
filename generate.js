const fs = require('fs')
const path = require('path')
const request = require('request')
function getpostgresqlReferenceIndexes (postgresqleVersionDir, indexes) {
  const postgresqlVersion = postgresqleVersionDir.match(/postgresql-(\d\d\.\d)/)[1]
  const pubPath = path.join(__dirname, 'public', 'postgresql-' + postgresqlVersion)
  const indexHtmlContent = fs.readFileSync(path.join(__dirname, postgresqleVersionDir, 'reference', 'index.html'), { encoding: 'utf-8' })
  const matchs = indexHtmlContent.match(/<a href=".*title=.*>/g)
  if (!matchs) throw new Error('😱  语言参考未匹配')
  let parentString = ''
  matchs.forEach(x => {
    var request_url = x.match(/https.*" /g)
    var title = x.match(/title.*"/g)
    var response = request(request_url ,function (error, response, data) {
   
      return data
      
    })
    // const rowMatches = x.match(/<li class="toctree-l(\d)">\s*<a class="reference internal" href="([^"\n]+?)">([\s\S]+?)<\/a>/)
    // if (rowMatches[1] === '1') {
    //   parentString = rowMatches[3].replace(/\d{1,2}\.(?:\d{1,2}\.)?/, '').trim()
    //   parentString = removeHtmlTag(parentString)
    //   const htmlContent = fs.readFileSync(path.join(__dirname, postgresqleVersionDir, 'reference', rowMatches[2].trim()), { encoding: 'utf-8' })
    //   writeHtmlFile(path.join(pubPath, 'reference', rowMatches[2].trim()), htmlContent, postgresqlVersion)
    //   return
    // }
    // let key = rowMatches[3].replace(/\d{1,2}\.(?:\d{1,2}\.)?/, '').trim()
    // key = removeHtmlTag(key)
    indexes.push({ t: title, p: 'reference/' + title, d: title })
  })
}
function main () {
  var args = process.argv.slice(2)
  const indexes = []
  const postgresqleVersionDir = args[0]
  if (!/postgresql-(\d\d\.\d)/.test(postgresqleVersionDir)) {throw new Error('文件夹错误')}
  const postgresqlVersion = RegExp.$1
  if (!fs.existsSync(path.join(__dirname, postgresqleVersionDir))) throw new Error(postgresqleVersionDir + '文件夹不存在')
  const pubPath = path.join(__dirname, 'public', 'postgresql-' + postgresqlVersion)
  if (!fs.existsSync(pubPath)) {
    fs.mkdirSync(pubPath)
    fs.mkdirSync(path.join(pubPath, 'reference'))
    fs.mkdirSync(path.join(pubPath, 'library'))
    fs.mkdirSync(path.join(pubPath, '_images'))
    fs.copyFileSync(path.join(__dirname, 'postgresql.css'), path.join(pubPath, 'postgresql.css'))
    fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(pubPath, 'README.md'))
    fs.copyFileSync(path.join(__dirname, 'logo.png'), path.join(pubPath, 'logo.png'))
    fs.copyFileSync(path.join(__dirname, 'preload.js'), path.join(pubPath, 'preload.js'))
    const _imagesDir = path.join(__dirname, postgresqleVersionDir, '_images')
    const images = fs.readdirSync(_imagesDir)
    images.forEach(fimg => {
      fs.copyFileSync(path.join(_imagesDir, fimg), path.join(pubPath, '_images', fimg))
    })
    let pluginJsonContent = fs.readFileSync(path.join(__dirname, 'plugin.json'), { encoding: 'utf-8' })
    pluginJsonContent = pluginJsonContent.replace(/<version>/g, postgresqlVersion)
    fs.writeFileSync(path.join(pubPath, 'plugin.json'), pluginJsonContent)
  }
  getpostgresqlReferenceIndexes(postgresqleVersionDir, indexes)
}

main()