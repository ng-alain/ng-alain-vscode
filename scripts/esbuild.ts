#!/usr/bin/env node

/// <reference types="node" />

import path from 'path';
import fs from 'fs/promises';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'out');
const ENTRY = path.join(ROOT, 'src/main/extension.ts');
const ZH_I18N_SOURCE = path.join(ROOT, 'i18n/zh-cn/package.i18n.json');
const ZH_I18N_TARGET = path.join(ROOT, 'package.nls.zh-cn.json');
const WATCH_MODE = process.argv.includes('--watch');
const BUILTIN_MODULES = new Set([
  ...builtinModules.map((m) => m.replace(/^node:/, '')),
  ...builtinModules,
]);

async function clean(): Promise<void> {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
}

async function syncPackageI18n(): Promise<void> {
  await fs.copyFile(ZH_I18N_SOURCE, ZH_I18N_TARGET);
}

async function verifyRuntimeDependencies(): Promise<void> {
  const output = await fs.readFile(path.join(OUT_DIR, 'extension.js'), 'utf8');
  const requireDouble = [...output.matchAll(/require\("([^\"]+)"\)/g)].map((item) => item[1]);
  const requireSingle = [...output.matchAll(/require\('([^']+)'\)/g)].map((item) => item[1]);
  const requires = [...new Set([...requireDouble, ...requireSingle])];

  const externalRuntimeRequires = requires.filter((specifier) => {
    if (specifier === 'vscode') {
      return false;
    }
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      return false;
    }
    const normalized = specifier.replace(/^node:/, '');
    return !BUILTIN_MODULES.has(normalized) && !BUILTIN_MODULES.has(specifier);
  });

  if (externalRuntimeRequires.length > 0) {
    throw new Error(
      [
        'Found external runtime dependencies in out/extension.js:',
        ...externalRuntimeRequires.map((item) => `- ${item}`),
        'Either bundle them into out/extension.js or stop excluding node_modules for those packages in .vscodeignore.',
      ].join('\n'),
    );
  }
}

function buildOptions(): esbuild.BuildOptions {
  return {
    entryPoints: [ENTRY],
    // `outfile` + `bundle: true` keeps output as a single JS file (no chunk splitting).
    outfile: path.join(OUT_DIR, 'extension.js'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'es2020',
    sourcemap: true,
    tsconfig: path.join(ROOT, 'tsconfig.json'),
    // jsonc-parser's UMD entry contains runtime relative requires (./impl/*),
    // which breaks single-file extension bundles in VS Code.
    alias: {
      'jsonc-parser': 'jsonc-parser/lib/esm/main.js',
    },
    external: ['vscode'],
    logLevel: 'info',
    plugins: [
      {
        name: 'sync-package-i18n',
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) {
              return;
            }
            await syncPackageI18n();
          });
        },
      },
    ],
  };
}

async function runBuild(): Promise<void> {
  await clean();

  if (WATCH_MODE) {
    const ctx = await esbuild.context(buildOptions());
    await ctx.watch();
    return;
  }

  await esbuild.build(buildOptions());
  await verifyRuntimeDependencies();
}

runBuild().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
