import {
  CodeAction,
  CodeActionKind,
  CodeActionProvider,
  Command,
  ProviderResult,
  Range,
  Selection,
  TextDocument,
  workspace,
  WorkspaceEdit,
  window,
} from 'vscode';
import { join } from 'path';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { parse } from 'jsonc-parser';
import { CONFIG, NAME } from '../config';
import * as nls from 'vscode-nls';
const localize = nls.config({ messageFormat: nls.MessageFormat.both })();

export interface I18nCommandArg {
  text: string;
  key: string;
  pipe: 'none' | 'interpolation' | 'no-interpolation';
  start: number;
  end: number;
  line: number;
}

export class I18nProvider implements CodeActionProvider {
  provideCodeActions(document: TextDocument, range: Range | Selection): ProviderResult<(Command | CodeAction)[]> {
    const line = document.lineAt(range.start.line).text;
    const lineMatch = line.match(/[`']([^`']+)[`']/g);
    if (lineMatch == null) {
      return null;
    }
    const actions: CodeAction[] = [];
    const pointer = range.start.character;
    line.replace(/[`']([^`']+)[`']/g, (_: string, text: string, pos: number) => {
      const start = pos;
      const end = pos + text.length + 2;
      if (pointer >= start && pointer <= end) {
        const i18nKey = CONFIG.i18n[text];
        if (i18nKey && i18nKey.length > 0) {
          actions.push(
            {
              title: localize('action.title', `Extract {0} as {1}`, text, i18nKey),
              kind: CodeActionKind.QuickFix,
              command: {
                title: '',
                command: `${NAME}.extractI18N`,
                arguments: [{ text, key: i18nKey, line: range.start.line, start, end, pipe: 'none' } as I18nCommandArg],
              },
            },
            {
              title: localize('action.title', `Extract {0} as {1}`, text, `'${i18nKey}' | ${CONFIG.i18nPipeName}`),
              kind: CodeActionKind.QuickFix,
              command: {
                title: '',
                command: `${NAME}.extractI18N`,
                arguments: [
                  {
                    text,
                    key: i18nKey,
                    line: range.start.line,
                    start,
                    end,
                    pipe: 'no-interpolation',
                  } as I18nCommandArg,
                ],
              },
            },
            {
              title: localize('action.title', `Extract {0} as {1}`, text, `{{ '${i18nKey}' | ${CONFIG.i18nPipeName} }}`),
              kind: CodeActionKind.QuickFix,
              command: {
                title: '',
                command: `${NAME}.extractI18N`,
                arguments: [
                  {
                    text,
                    key: i18nKey,
                    line: range.start.line,
                    start,
                    end,
                    pipe: 'interpolation',
                  } as I18nCommandArg,
                ],
              },
            },
          );
        }
        actions.push({
          title: localize('action.title.custom', `Extract {0} as a custom I18n variable`, text),
          kind: CodeActionKind.QuickFix,
          command: {
            title: '',
            command: `${NAME}.extractI18N`,
            arguments: [{ text, key: '', line: range.start.line, start, end, pipe: 'none' } as I18nCommandArg],
          },
        });
      }
      return '';
    });
    return actions;
  }
}

export function I18nCommand(args: I18nCommandArg): Promise<void> {
  return new Promise((resolve) => {
    if (args.key && args.key.length > 0) {
      return resolve(args.key);
    }
    return resolve(
      window.showInputBox({
        prompt: localize('input.box', 'Please enter the I18n variable name, press <Enter> to replace'),
        value: args.text,
        validateInput: (input): string => {
          if (input.length <= 0) {
            return localize('input.box.required', 'Variable name is required');
          }
          // 缓存
          CONFIG.i18n[args.text] = input;
        },
      }),
    );
  }).then((val: string) => {
    const { document } = window.activeTextEditor;
    try {
      const edit = new WorkspaceEdit();
      let text = `'${val}'`;
      switch (args.pipe) {
        case 'interpolation':
          text = `{{ '${val}' | ${CONFIG.i18nPipeName} }}`;
          break;
        case 'no-interpolation':
          text = `'${val}' | ${CONFIG.i18nPipeName}`;
          break;
      }
      edit.replace(document.uri, new Range(args.line, args.start, args.line, args.end), text);
      workspace.applyEdit(edit);
    } catch (ex) {
      window.showErrorMessage(localize('replace.error', `Update failed, reason: {0}`, ex.message));
    }
  });
}

function pushI18nItem(data: any): void {
  const fn = (obj: any): void => {
    for (const key in obj) {
      if (!obj[key]) continue;
      const value = obj[key];
      if (value == null) {
        return;
      }
      if (typeof value === 'string') {
        CONFIG.i18n[value] = key;
      } else if (typeof value === 'object') {
        fn(value);
      }
    }
  };

  fn(data);
}

function showError(ex: { message: string }): void {
  window.showErrorMessage(localize('load.error', `Failed to load the internationalized dictionary, reason: {0}`, ex.message));
}

function genPath(value: string): string | null {
  if (workspace.workspaceFolders.length === 0) {
    return null;
  }
  return join(workspace.workspaceFolders[0].uri.path, value);
}

function readJson(filePath: string): any {
  return parse(readFileSync(filePath).toString('utf8'));
}

function loadI18nViaFile(file: string): void {
  const filePath = genPath(file);
  if (filePath == null) {
    return;
  }
  try {
    const res = readJson(filePath);
    pushI18nItem(res);
  } catch (ex) {
    showError(ex);
  }
}

async function loadI18nViaNode(file: string): Promise<void> {
  const filePath = genPath(file);
  if (filePath == null) {
    return;
  }
  try {
    const res = await import(filePath);
    pushI18nItem(res);
  } catch (ex) {
    showError(ex);
  }
}

async function loadI18nViaRemote(url: string): Promise<void> {
  try {
    const res = parse(await (await fetch(url, CONFIG.i18nRemoteOptions)).text());
    pushI18nItem(res);
  } catch (ex) {
    showError(ex);
  }
}

export async function loadI18nFiles(): Promise<void> {
  CONFIG.i18n = {};

  for (const item of CONFIG.i18nData) {
    switch (item.type) {
      case 'file':
        loadI18nViaFile(item.path);
        break;
      case 'node':
        await loadI18nViaNode(item.path);
        break;
      case 'remote':
        await loadI18nViaRemote(item.path);
        break;
    }
  }
}

export function checkAuto(): void {
  if (CONFIG.i18nStatus !== 'auto') return;
  // 检查当前项目是否包含 @angular/localize，@ngx-translate/core
  const packageJson = genPath('package.json');
  try {
    const json = readJson(packageJson);
    if (['@angular/localize', '@ngx-translate/core'].some((libName) => !!json.dependencies[libName] || !!json.devDependencies[libName])) {
      CONFIG.i18nStatus = 'enabled';
    }
  } catch {
    CONFIG.i18nStatus = 'disabled';
  }
}
