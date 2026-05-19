import * as vscode from 'vscode';

class Notifier {
  public statusBarItem: vscode.StatusBarItem;
  private timeoutId: any;

  constructor(command?: string, alignment?: vscode.StatusBarAlignment, priority?: number) {
    this.statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
    this.statusBarItem.command = command;
    this.statusBarItem.show();
  }

  public show(): void {
    this.statusBarItem.show();
  }

  public hide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.statusBarItem.hide();
  }

  public notify(icon: string, text: string, autoHide: boolean = true): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.statusBarItem.text = `$(${icon}) ${text}`;
    this.statusBarItem.tooltip = undefined;

    if (autoHide) {
      this.timeoutId = setTimeout(() => {
        this.statusBarItem.text = `$(${icon})`;
        this.statusBarItem.tooltip = text;
      }, 5000);
    }
  }

  public dispose(): void {
    this.hide();
    this.statusBarItem.dispose();
  }
}

export default Notifier;
