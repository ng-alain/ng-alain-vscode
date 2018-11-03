import { existsSync, readFileSync } from 'fs';
import * as less from 'less';
import { dirname, join } from 'path';
import { workspace } from 'vscode';

import Notifier from './notifier';
const KEYS = `ng-alain-vscode`;

function plugin(less: any, opt: any): void {
  const fm = new less.FileManager();
  fm.supports = function(filename, currentDirectory) {
    const npmProtocolPrefixRegex = new RegExp('^' + opt.prefix, 'i');
    return (
      filename.match(npmProtocolPrefixRegex) ||
      currentDirectory.match(npmProtocolPrefixRegex)
    );
  };
  fm.loadFile = function(
    filename,
    currentDirectory,
    options,
    environment,
    callback,
  ) {
    filename = join(
      opt.rootPath,
      'node_modules',
      filename.replace(opt.prefix, ''),
    );
    return less.environment.fileManagers[0].loadFile(
      filename,
      currentDirectory,
      options,
      environment,
      callback,
    );
  };
  return fm;
}

class NgAlainImportPlugin {
  constructor(private options: any) {}

  install(less: any, pluginManager: any) {
    pluginManager.addFileManager(new plugin(less, this.options));
  }
}

export async function NgAlainCss(notifier: Notifier): Promise<string> {
  // 1. find angular.json
  const angularJsonUris = await workspace.findFiles(
    'angular.json',
    '**/node_modules/**',
    1,
  );
  if (!angularJsonUris || angularJsonUris.length === 0) {
    notifier.notify('alert', `${KEYS}: 未找到 angular.json 文件`);
    return null;
  }
  // 2. find default project
  const angularJson = JSON.parse(
    readFileSync(angularJsonUris[0].fsPath).toString(),
  );
  let projectName = angularJson.defaultProject;
  if (!projectName) {
    const allProjectNames = Object.keys(angularJson.projects).filter(
      w => !w.endsWith('-e2e'),
    );
    if (allProjectNames.length === 0) {
      notifier.notify('hubot', `${KEYS}: 未找到任何默认项目`);
      return null;
    }
    projectName = allProjectNames[0];
  }

  const rootPath = dirname(angularJsonUris[0].fsPath);
  const sourceRoot = angularJson.projects[projectName].sourceRoot || 'src';
  const lessPath = join(rootPath, sourceRoot, 'styles.less');
  if (!existsSync(lessPath)) {
    notifier.notify('hubot', `${KEYS}: 未找到任何默认项目`);
    return null;
  }

  notifier.notify('eye', `${KEYS}: 正在编译ng-alain样式...`);
  const lessContent = readFileSync(lessPath).toString();
  const lessRes = await less.render(lessContent, {
    javascriptEnabled: true,
    paths: [join(rootPath, sourceRoot), rootPath],
    plugins: [
      new NgAlainImportPlugin({
        rootPath,
        prefix: `~`,
      }),
    ],
  });

  return lessRes.css;
}
