import { CompletionItem, CompletionItemKind, CompletionItemProvider, MarkdownString, Position, Range, TextDocument } from 'vscode';
import { CONFIG } from '../config';

export default class implements CompletionItemProvider {
  constructor(private classMatchRegexs: RegExp[]) {}

  provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
    if (CONFIG.caching) {
      return null;
    }
    const start: Position = new Position(position.line, 0);
    const range: Range = new Range(start, position);
    const text: string = document.getText(range);

    // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
    let rawClasses: RegExpMatchArray;
    for (const re of this.classMatchRegexs) {
      rawClasses = text.match(re);
      if (rawClasses == null) {
        continue;
      }

      break;
    }
    if (!rawClasses || rawClasses.length === 1) {
      return [];
    }

    // Will store the classes found on the class attribute
    const classesOnAttribute = rawClasses[1].split(' ');

    // Creates a collection of CompletionItem based on the classes already cached
    const completionItems = CONFIG.classes.map((item) => {
      const completionItem = new CompletionItem(item.name);
      completionItem.kind = CompletionItemKind.Variable;
      if (item.comment) {
        completionItem.documentation = item.comment;
      }

      const completionClassName = item.name;
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
  }
}
