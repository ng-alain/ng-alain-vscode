import { join } from 'path';

function plugin(less: any, opt: any): void {
  const fm = new less.FileManager();
  fm.supports = (filename: string, currentDirectory: string) => {
    const npmProtocolPrefixRegex = new RegExp('^' + opt.prefix, 'i');
    return filename.match(npmProtocolPrefixRegex) || currentDirectory.match(npmProtocolPrefixRegex);
  };
  fm.loadFile = (filename: string, currentDirectory: any, options: any, environment: any, callback: any) => {
    filename = join(opt.rootPath, 'node_modules', filename.replace(opt.prefix, ''));
    return less.environment.fileManagers[0].loadFile(filename, currentDirectory, options, environment, callback);
  };
  return fm;
}

export class NgAlainImportPlugin {
  constructor(private options: any) {}

  install(less: any, pluginManager: any) {
    pluginManager.addFileManager(plugin(less, this.options));
  }
}
