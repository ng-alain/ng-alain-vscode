import { workspace } from 'vscode';
import { checkAuto, loadI18nFiles } from './plugin/i18n-provider';
import { LessToCssNode } from './types';

export const NAME = 'ng-alain-vscode';

export type I18nStatus = 'auto' | 'enabled' | 'disabled';

export const CONFIG: {
  caching: boolean;
  classes: LessToCssNode[];
  i18nStatus: I18nStatus;
  i18nPipeName: string;
  i18nData: ConfigI18nData[];
  i18n: { [key: string]: string };
  i18nRemoteOptions?: any;
  lessBuildPaths: string[];
} = {
  caching: false,
  classes: [],
  i18nStatus: 'auto',
  i18nPipeName: '',
  i18nData: [],
  i18n: {},
  lessBuildPaths: [],
};

export interface ConfigI18nData {
  path: string;
  type: 'file' | 'remote' | 'node';
}

export function reloadConfig(): void {
  const cog = workspace.getConfiguration(NAME);
  CONFIG.i18nStatus = cog.get('i18nStatus', 'auto') as I18nStatus;
  CONFIG.i18nPipeName = cog.get('i18nPipeName', 'i18n');
  CONFIG.i18nData = cog.get('i18nData', []);
  CONFIG.lessBuildPaths = cog.get('lessBuildPaths', []);

  checkAuto();
  if (CONFIG.i18nStatus === 'enabled') {
    if (!Array.isArray(CONFIG.i18nData) || CONFIG.i18nData.length === 0) {
      CONFIG.i18nData.push({
        path: 'src/assets/tmp/i18n/zh-CN.json',
        type: 'file',
      });
    }

    loadI18nFiles();
  }
}
