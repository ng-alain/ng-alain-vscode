import { Hover, HoverProvider, Position, ProviderResult, TextDocument } from 'vscode';
import { CONFIG } from '../config';

function findClassName(text: string, pos: number): string {
  let start = pos;
  let end = pos;
  while (start >= 0 && text[start] !== '"' && text[start] !== ' ') {
    start--;
  }
  const maxEnd = text.length;
  while (end <= maxEnd && text[end] !== '"' && text[end] !== ' ') {
    end++;
  }
  return text.substring(start + 1, end);
}

export default class implements HoverProvider {
  provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
    if (CONFIG.caching) {
      return null;
    }
    const line = document.lineAt(position).text;
    const classMatch = line.match(/class="([^"]+)"/);
    if (classMatch == null || classMatch.length !== 2) {
      return null;
    }
    const start = classMatch.index + 7;
    const end = start + classMatch[1].length;
    const pointerPos = position.character;
    // 检查光标是否在类名上
    if (pointerPos < start || pointerPos > end) {
      return null;
    }
    // 查找
    const className = findClassName(line, pointerPos);
    if (className) {
      const item = CONFIG.classes.find((w) => w.name === className);
      if (item && item.comment) {
        return new Hover(item.comment);
      }
    }
    return null;
  }
}
