import { join } from 'path';

function plugin(less: any, opt: any): void {
  const fm = new less.FileManager();
  fm.supports = (filename, currentDirectory) => {
    const npmProtocolPrefixRegex = new RegExp('^' + opt.prefix, 'i');
    return filename.match(npmProtocolPrefixRegex) || currentDirectory.match(npmProtocolPrefixRegex);
  };
  fm.loadFile = (filename, currentDirectory, options, environment, callback) => {
    filename = join(opt.rootPath, 'node_modules', filename.replace(opt.prefix, ''));
    return less.environment.fileManagers[0].loadFile(filename, currentDirectory, options, environment, callback);
  };
  return fm;
}

export class NgAlainImportPlugin {
  constructor(private options: any) {}

  install(less: any, pluginManager: any) {
    pluginManager.addFileManager(new plugin(less, this.options));
  }
}
