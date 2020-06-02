import {
  Hover,
  HoverProvider,
  Position,
  ProviderResult,
  Range,
  TextDocument,
} from 'vscode';
import { CONFIG } from '../config';

export default class implements HoverProvider {
  provideHover(
    document: TextDocument,
    position: Position,
  ): ProviderResult<Hover> {
    if (CONFIG.caching) {
      return null;
    }
    const range: Range = new Range(
      new Position(position.line, 0),
      new Position(position.line + 1, 0),
    );
    const text: string = document.getText(range);
    // const word = findWord(text, position);
    // if (word.length === 0) {
    //   return null;
    // }
    return null;
  }
}
