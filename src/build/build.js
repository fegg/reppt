import fs from 'fs'
import path from 'path'
import readConfig from './readConfig'
import transpileProjectPlugins from './transpileProjectPlugins'
import genPPTJs from './genPPTJs'
import buildProject from './buildProject'
import utils from '../utils'

const { log } = utils

export default async function build () {
  const rootPath = process.cwd()
  const stat = fs.statSync(rootPath)

  if (!stat.isDirectory()) {
    throw new Error(`非法目录: ${rootPath}.`)
  }

  log('正在读取配置...')
  const configFilename = path.join(rootPath, 'reppt.config.json')
  const config = readConfig(configFilename)

  log('正在转译插件脚本...')
  await transpileProjectPlugins(config)

  const markdownFilename = path.join(rootPath, 'src/ppt.md')
  const pptFilename = path.join(rootPath, 'src/ppt.js')
  const projectPluginsFilename = path.join(rootPath, 'plugins5/index.js')

  log('正在生成PPT脚本...')
  await genPPTJs(config, pptFilename, markdownFilename, projectPluginsFilename)

  log('正在构建项目...')
  await buildProject(config, rootPath)
}
