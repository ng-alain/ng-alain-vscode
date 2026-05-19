import { commands, Disposable, ExtensionContext, languages, window, workspace } from 'vscode';
import * as nls from 'vscode-nls';
import { CONFIG, NAME, reloadConfig } from './config';
import { LessToCss } from './less-to-css';
import Notifier from './notifier';
import AutoCompletionItemProvider from './plugin/completion-provider';
import HoverProvider from './plugin/hover-provider';
import { I18nCommand, I18nProvider } from './plugin/i18n-provider';
const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

const notifier = new Notifier(NAME + '.cache');
const emmetDisposables: Disposable[] = [];
const classFeatureDisposables: Disposable[] = [];
const completionTriggerChars = ['"', "'", ' ', '.'];
const languageSchemes = [
  { scheme: 'file', language: 'html' },
  { scheme: 'file', language: 'typescript' },
];

function disposeAll(disposables: Disposable[]): void {
  disposables.forEach((disposable) => disposable.dispose());
  disposables.length = 0;
}

function syncClassFeatures(): void {
  disposeAll(classFeatureDisposables);

  if (CONFIG.classMode === 'disabled') {
    notifier.hide();
    CONFIG.classes = [];
    return;
  }

  notifier.show();

  if (CONFIG.classMode === 'enabled') {
    classFeatureDisposables.push(
      ...languageSchemes.map((scheme) => {
        return languages.registerCompletionItemProvider(
          scheme,
          new AutoCompletionItemProvider([/\[?ngClass\]?="{[ ]?'([\w\- ]*$)/, /class=["|']([\w\- ]*$)/, /\[class\.([\w\- ]*$)/]),
          ...completionTriggerChars,
        );
      }),
    );
  }

  classFeatureDisposables.push(languages.registerHoverProvider(languageSchemes, new HoverProvider()));
  classFeatureDisposables.push(
    commands.registerCommand('ng-alain-vscode.cache', async () => {
      if (CONFIG.caching) {
        return;
      }

      await do_cache();
    }),
  );
}

async function do_cache() {
  CONFIG.caching = true;
  try {
    const cssRes = await LessToCss(notifier);
    if (cssRes === null) {
      return;
    }
    CONFIG.classes = cssRes.nodes;

    notifier.notify('zap', localize('again', 'NG-ALAIN CSS classes cached (click to cache again), enter: {0}', cssRes.filePath));
  } catch (err) {
    notifier.notify('alert', localize('fail', 'Failed to cache the CSS classes in the workspace (click for another attempt)'));
    window.showErrorMessage(err instanceof Error ? err.message : String(err));
  } finally {
    CONFIG.caching = false;
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  reloadConfig();

  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (!event.affectsConfiguration(NAME)) {
        return;
      }

      reloadConfig();
      syncClassFeatures();
    }),
  );

  syncClassFeatures();

  // Quick i18n
  if (CONFIG.i18nStatus === 'enabled') {
    emmetDisposables.push(languages.registerCodeActionsProvider(languageSchemes, new I18nProvider()));
    emmetDisposables.push(commands.registerCommand(`${NAME}.extractI18N`, (args) => I18nCommand(args)));
  }

  context.subscriptions.push(...emmetDisposables);

  if (CONFIG.classMode !== 'disabled') {
    await do_cache();
  }
}

export function deactivate(): void {
  notifier.dispose();
  disposeAll(classFeatureDisposables);
  disposeAll(emmetDisposables);
}
