import { existsSync, readFileSync } from 'fs';
import * as less from 'less';
import { dirname, join } from 'path';
import { workspace, MarkdownString } from 'vscode';
import Notifier from './notifier';
import { NgAlainImportPlugin } from './plugin-less-import';
import { LessToCssNode, LessToCssResult } from './types';

const KEYS = `ng-alain-vscode`;
const KEYS_AUTOGENERATE = 'AUTOGENERATE:';

function getComment(idx: number, lines: string[]): string {
  if (idx < 0) {
    return '';
  }
  // Process: AUTOGENERATE
  let nextLine = lines.length > idx + 1 ? lines[idx + 1].trim() : '';
  if (nextLine.includes(KEYS_AUTOGENERATE)) {
    nextLine = nextLine.split(KEYS_AUTOGENERATE)[1].split('*/')[0].trim();
    return nextLine.replace(/\"/g, '`').split(`|SPLIT|`).join('\n\n');
  }
  const comments: string[] = [];
  let preText = lines[--idx].trim();
  while (/^((\*\/)|(\* ))/.test(preText)) {
    if (preText.includes('LICENSE')) {
      break;
    }
    comments.push(preText.substr(2).trim());
    preText = lines[--idx].trim();
  }
  return comments
    .filter((w) => !!w)
    .reverse()
    .join('\n\n');
}

function parseNodes(css: string, notifier: Notifier): LessToCssNode[] {
  notifier.notify('eye', `${KEYS}: 正在解析有效的ng-alain样式...`);
  const res: LessToCssNode[] = [];
  const lines = css.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\.([^ |,]+)/);
    if (!match || match.length <= 0) {
      continue;
    }
    const cls = match[0].substr(1);
    if (
      res.findIndex((w) => w.name === cls) !== -1 ||
      !/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/g.test(cls) || // .a:hover {}
      (cls.startsWith('ant-') && !cls.includes('__')) // .ant-btn
    ) {
      continue;
    }
    let comment = '';
    try {
      comment = getComment(i, lines);
    } catch {
      console.log(`Parse error`);
    }
    res.push({
      comment: comment.length > 0 ? new MarkdownString(comment) : null,
      name: cls,
    });
  }

  return res;
}

export async function LessToCss(notifier: Notifier): Promise<LessToCssResult> {
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
      (w) => !w.endsWith('-e2e'),
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

  notifier.notify(
    'eye',
    `${KEYS}: 正在编译[${projectName}]项目的样式，入口${lessPath}...`,
  );
  const lessRes = await less.render(readFileSync(lessPath).toString('utf8'), {
    javascriptEnabled: true,
    paths: [join(rootPath, sourceRoot), rootPath],
    plugins: [
      new NgAlainImportPlugin({
        prefix: `~`,
        rootPath,
      }),
    ],
  });

  return {
    filePath: lessPath,
    nodes: parseNodes(lessRes.css, notifier),
  };
}
