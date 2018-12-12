import * as VError from 'verror';
import {
  commands,
  CompletionItem,
  CompletionItemKind,
  Disposable,
  ExtensionContext,
  languages,
  Position,
  Range,
  TextDocument,
  window,
  workspace,
} from 'vscode';
import Notifier from './notifier';
import { NgAlainCss } from './ng-alain-css';

const KEYS = `ng-alain-vscode`;
const completionTriggerChars = ['"', "'", ' ', '.'];
const notifier = new Notifier(KEYS + '.cache');
let caching: boolean = false;
let uniqueClasses: string[] = [];
const emmetDisposables: Array<{ dispose(): any }> = [];
const WHITES = [];

async function cache(): Promise<void> {
  try {
    const css = await NgAlainCss(notifier);
    if (css === null) return;

    notifier.notify('eye', `${KEYS}: 正在解析有效的ng-alain样式...`);
    const res = css
      .split('\n')
      .map(line => line.match(/^\.([^ |,]+)/))
      .filter(match => match && match.length > 0)
      .map(match => match[0].substr(1))
      .filter(cls => cls.indexOf('.') === -1 && cls.indexOf(':') === -1)
      .filter(cls => !cls.startsWith('alain-'))
      .filter(
        cls =>
          !(
            cls.startsWith('ant-') &&
            cls.indexOf('__') === -1 &&
            !WHITES.includes(cls)
          ),
      );
    uniqueClasses = [...new Set([...res])];
    notifier.notify(
      'zap',
      'ng-alain CSS classes cached (click to cache again)',
    );
  } catch (err) {
    notifier.notify(
      'alert',
      'Failed to cache the CSS classes in the workspace (click for another attempt)',
    );
    throw new VError(
      err,
      'Failed to cache the class definitions during the iterations over the documents that were found',
    );
  }
}

async function do_cache() {
  caching = true;
  try {
    await cache();
  } catch (err) {
    err = new VError(err, `缓存失败，点击重试，或打开 Dev Tools 了解详情`);
    console.error(err);
    window.showErrorMessage(err.message);
  } finally {
    caching = false;
  }
}

function provideCompletionItemsGenerator(
  languageSelector: string,
  classMatchRegex: RegExp,
  classPrefix: string = '',
  splitChar: string = ' ',
) {
  return languages.registerCompletionItemProvider(
    languageSelector,
    {
      provideCompletionItems(
        document: TextDocument,
        position: Position,
      ): CompletionItem[] {
        const start: Position = new Position(position.line, 0);
        const range: Range = new Range(start, position);
        const text: string = document.getText(range);

        // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
        const rawClasses: RegExpMatchArray = text.match(classMatchRegex);
        if (!rawClasses || rawClasses.length === 1) {
          return [];
        }

        // Will store the classes found on the class attribute
        const classesOnAttribute = rawClasses[1].split(splitChar);

        // Creates a collection of CompletionItem based on the classes already cached
        const completionItems = uniqueClasses.map(cls => {
          const completionItem = new CompletionItem(cls);
          completionItem.kind = CompletionItemKind.Variable;
          const completionClassName = `${classPrefix}${cls}`;

          completionItem.filterText = completionClassName;
          completionItem.insertText = completionClassName;

          return completionItem;
        });

        // Removes from the collection the classes already specified on the class attribute
        for (const classOnAttribute of classesOnAttribute) {
          for (let j = 0; j < completionItems.length; j++) {
            if (completionItems[j].insertText === classOnAttribute) {
              completionItems.splice(j, 1);
            }
          }
        }

        return completionItems;
      },
    },
    ...completionTriggerChars,
  );
}

export async function activate(context: ExtensionContext): Promise<void> {
  const disposables: Disposable[] = [];
  workspace.onDidChangeConfiguration(
    async () => await do_cache(),
    null,
    disposables,
  );
  context.subscriptions.push(...disposables);

  context.subscriptions.push(
    commands.registerCommand('ng-alain-vscode.cache', async () => {
      if (caching) {
        return;
      }

      await do_cache();
    }),
  );

  // Javascript based extensions
  ['typescript', 'javascript'].forEach(extension => {
    context.subscriptions.push(
      provideCompletionItemsGenerator(
        extension,
        /\[?ngClass\]?="{[ ]?'([\w\- ]*$)/,
      ),
    );
    context.subscriptions.push(
      provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/),
    );
  });

  ['html', 'markdown'].forEach(extension => {
    context.subscriptions.push(
      provideCompletionItemsGenerator(
        extension,
        /\[?ngClass\]?="{[ ]?'([\w\- ]*$)/,
      ),
    );
    context.subscriptions.push(
      provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/),
    );
  });

  // CSS based extensions
  // ['css', 'sass', 'scss', 'less'].forEach(extension => {
  //   // Support for Tailwind CSS
  //   context.subscriptions.push(
  //     provideCompletionItemsGenerator(extension, /@apply ([\.\w- ]*$)/, '.'),
  //   );
  // });

  await do_cache();
}

export function deactivate(): void {
  emmetDisposables.forEach(disposable => disposable.dispose());
}
