import { existsSync, readFileSync } from 'fs';
import * as less from 'less';
import { dirname, join } from 'path';
import { MarkdownString, workspace } from 'vscode';
import * as nls from 'vscode-nls';
import { CONFIG } from './config';
import Notifier from './notifier';
import { NgAlainImportPlugin } from './plugin-less-import';
import { LessToCssNode, LessToCssResult } from './types';
const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

const KEYS = `ng-alain-vscode`;
const KEYS_AUTOGENERATE = 'AUTOGENERATE:';
const INGORE_DELON = [
  'sv__',
  'se__',
  'sg__',
  'sf__',
  'st__',
  'alain-default',
  'avatar-list__',
  'yn__',
  'g2-',
  'page-header',
  'ellipsis__',
  'exception__',
  'footer__',
  'global-footer',
  'notice-icon',
  'number-info',
  'footer-toolbar',
  'full-content',
  'loading-default',
  'setting-drawer',
  'onboarding',
  'result__',
  'reuse-tab',
  'quick-menu',
  'sidebar-nav',
  'tag-select',
  'trend__',
];

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

  const comment = interceptComment('before', idx, lines);
  if (comment && comment.length > 0) {
    return comment;
  }

  // TODO: Less 在生成内联会使注释错位，https://github.com/less/less.js/issues/3511
  return interceptComment('after', idx, lines);
}

function interceptComment(type: 'before' | 'after', idx: number, lines: string[]): string {
  let comments: string[] = [];
  let preText = lines[type === 'before' ? --idx : ++idx].trim();
  while (/^(\*\/)|(\* ?)|(\/\*)/.test(preText)) {
    if (preText.includes('LICENSE')) {
      break;
    }
    comments.push(preText === '*' ? '  ' : preText.substr(2));
    preText = lines[type === 'before' ? --idx : ++idx].trim();
  }
  comments = comments.filter((w) => !!w && w.length > 1);
  if (type === 'before') {
    comments = comments.reverse();
  }
  return comments.join('\n').trim();
}

function parseNodes(css: string, notifier: Notifier): LessToCssNode[] {
  notifier.notify('eye', KEYS + localize('parseIng', ': Parsing valid ng-alain style...'));
  const res: LessToCssNode[] = [];
  const lines = css.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^\.([^ |,]+)/);
    if (!match || match.length <= 0) {
      continue;
    }
    const cls = match[0].substr(1);
    if (
      res.findIndex((w) => w.name === cls) !== -1 ||
      !/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/g.test(cls) || // .a:hover {}
      (cls.startsWith('ant-') && !cls.includes('__')) || // .ant-btn
      INGORE_DELON.findIndex((w) => cls.startsWith(w)) !== -1
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
  const angularJsonUris = await workspace.findFiles('angular.json', '**/node_modules/**', 1);
  if (!angularJsonUris || angularJsonUris.length === 0) {
    notifier.notify('alert', KEYS + localize('notFoundAngularJson', ': Angular.json file not found'));
    return null;
  }
  // 2. find default project
  const angularJson = JSON.parse(readFileSync(angularJsonUris[0].fsPath).toString());
  let projectName = angularJson.defaultProject;
  if (!projectName) {
    const allProjectNames = Object.keys(angularJson.projects).filter((w) => !w.endsWith('-e2e'));
    if (allProjectNames.length === 0) {
      notifier.notify('hubot', KEYS + localize('notFoundDefaultProject', ': No default project was found'));
      return null;
    }
    projectName = allProjectNames[0];
  }

  const rootPath = dirname(angularJsonUris[0].fsPath);
  const sourceRoot = angularJson.projects[projectName].sourceRoot || 'src';
  const lessPath = join(rootPath, sourceRoot, 'styles.less');
  if (!existsSync(lessPath)) {
    notifier.notify('hubot', KEYS + localize('notFoundDefaultProject', ': No default project was found'));
    return null;
  }

  notifier.notify('eye', KEYS + localize('compiling', ': Compiling [{0}] project style, less entry:  {1}...', projectName, lessPath));
  const paths = [join(rootPath, sourceRoot), rootPath, join(rootPath, 'node_modules/'), ...CONFIG.lessBuildPaths].filter((w) => !!w);
  try {
    const lessRes = await less.render(readFileSync(lessPath).toString('utf8'), {
      javascriptEnabled: true,
      paths,
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
  } catch (ex) {
    notifier.notify(
      'alert',
      KEYS + localize('less-error', ': Less compilation error: {0}, less entry: {1}, paths: {2}', ex.message, lessPath, paths.join(',')),
    );
    return null;
  }
}
