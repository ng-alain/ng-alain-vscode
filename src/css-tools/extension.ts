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
import { LessToCss } from './less-to-css';
import Notifier from './notifier';
import { LessToCssNode } from './types';

const KEYS = `ng-alain-vscode`;
const completionTriggerChars = ['"', "'", ' ', '.'];
const notifier = new Notifier(KEYS + '.cache');
let caching: boolean = false;
let uniqueClasses: LessToCssNode[] = [];
const emmetDisposables: Array<{ dispose(): any }> = [];

async function cache(): Promise<void> {
  try {
    const cssRes = await LessToCss(notifier);
    if (cssRes === null) {
      return;
    }

    uniqueClasses = cssRes.nodes;
    notifier.notify(
      'zap',
      `ng-alain CSS classes cached (click to cache again), enter: ${cssRes.filePath}`,
    );
  } catch (err) {
    notifier.notify(
      'alert',
      'Failed to cache the CSS classes in the workspace (click for another attempt)',
    );
    throw new Error(err);
  }
}

async function do_cache() {
  caching = true;
  try {
    await cache();
  } catch (err) {
    console.error(`缓存失败，点击重试，或打开 Dev Tools 了解详情`);
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
        const completionItems = uniqueClasses.map((item) => {
          const completionItem = new CompletionItem(item.name);
          completionItem.kind = CompletionItemKind.Variable;
          completionItem.documentation = item.comment;

          const completionClassName = `${classPrefix}${item.name}`;
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
  ['typescript', 'javascript'].forEach((extension) => {
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

  ['html', 'markdown'].forEach((extension) => {
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

  await do_cache();
}

export function deactivate(): void {
  emmetDisposables.forEach((disposable) => disposable.dispose());
}
