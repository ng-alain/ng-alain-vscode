import {
  commands,
  Disposable,
  ExtensionContext,
  languages,
  window,
} from 'vscode';
import * as nls from 'vscode-nls';
import { CONFIG } from './config';
import { LessToCss } from './less-to-css';
import Notifier from './notifier';
import AutoCompletionItemProvider from './plugin/completion-provider';
import HoverProvider from './plugin/hover-provider';
const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

const KEYS = `ng-alain-vscode`;
const notifier = new Notifier(KEYS + '.cache');
const emmetDisposables: Disposable[] = [];
const completionTriggerChars = ['"', "'", ' ', '.'];

async function do_cache() {
  CONFIG.caching = true;
  try {
    const cssRes = await LessToCss(notifier);
    if (cssRes === null) {
      return;
    }
    CONFIG.classes = cssRes.nodes;

    notifier.notify(
      'zap',
      localize(
        'again',
        'NG-ALAIN CSS classes cached (click to cache again), enter: $1',
        cssRes.filePath,
      ),
    );
  } catch (err) {
    notifier.notify(
      'alert',
      localize(
        'fail',
        'Failed to cache the CSS classes in the workspace (click for another attempt)',
      ),
    );
    console.error(`缓存失败，点击重试，或打开 Dev Tools 了解详情`);
    window.showErrorMessage(err.message);
  } finally {
    CONFIG.caching = false;
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    commands.registerCommand('ng-alain-vscode.cache', async () => {
      if (CONFIG.caching) {
        return;
      }

      await do_cache();
    }),
  );

  const languageSchemes = [
    { scheme: 'file', language: 'html' },
    { scheme: 'file', language: 'typescript' },
  ];
  // complietion
  emmetDisposables.push(
    ...languageSchemes.map((scheme) => {
      return languages.registerCompletionItemProvider(
        scheme,
        new AutoCompletionItemProvider([
          /\[?ngClass\]?="{[ ]?'([\w\- ]*$)/,
          /class=["|']([\w\- ]*$)/,
          /\[class\.([\w\- ]*$)/,
        ]),
        ...completionTriggerChars,
      );
    }),
  );
  // Hover
  const hoverProvider = new HoverProvider();
  emmetDisposables.push(
    languages.registerHoverProvider(languageSchemes, hoverProvider),
  );

  context.subscriptions.push(...emmetDisposables);

  await do_cache();
}

export function deactivate(): void {
  emmetDisposables.forEach((disposable) => disposable.dispose());
}
