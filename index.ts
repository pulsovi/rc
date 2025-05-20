import * as cc from './lib/utils'
import { join } from 'path'
import * as deepExtend from 'deep-extend'
var etc = '/etc'
var win = process.platform === "win32"
var home = win
           ? process.env.USERPROFILE
           : process.env.HOME

function rc<T extends Record<string, any>> (
  name: string,
  defaults?: string | T,
  argv?: T | null,
  parse?: ((content: string) => { [key: string]: any })
): T & { config?: string, configs?: string[] } {
  if('string' !== typeof name)
    throw new Error('rc(name): name *must* be string')
  if(!argv)
    argv = require('minimist')(process.argv.slice(2)) as T
  const localDefault = ((
      'string' === typeof defaults
    ? cc.json(defaults) : defaults
    ) || {}) as T

  parse = parse || cc.parse

  var env = cc.env(name + '_') as T

  var configs: (T & { config?: string, configs?: string[] })[] = [localDefault]
  var configFiles: string[] = []
  function addConfigFile (file: string): void {
    if (configFiles.indexOf(file) >= 0) return
    var fileConfig = cc.file(file)
    if (fileConfig) {
      configs.push(parse(fileConfig) as T)
      configFiles.push(file)
    }
  }

  // which files do we look at?
  if (!win)
   [join(etc, name, 'config'),
    join(etc, name + 'rc')].forEach(addConfigFile)
  if (home)
   [join(home, '.config', name, 'config'),
    join(home, '.config', name),
    join(home, '.' + name, 'config'),
    join(home, '.' + name + 'rc')].forEach(addConfigFile)
  addConfigFile(cc.find('.'+name+'rc'))
  if (env.config) addConfigFile(env.config)
  if (argv.config) addConfigFile(argv.config)

  return deepExtend.apply(null, configs.concat([
    env,
    argv,
    configFiles.length ? { configs: configFiles, config: configFiles[configFiles.length - 1] } : undefined
  ]))
}
