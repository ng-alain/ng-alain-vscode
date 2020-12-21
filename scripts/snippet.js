const path = require('path');
const fs = require('fs');
const vscodeGen = require('vscode-snippet-generator/src/generator');
const root = path.join(__dirname, '..');
const DATA = {
  html: {
    sourceRoot: [path.join(root, 'src/snippets/html'), path.join(root, 'src/snippets/ng')]
  },
  ts: {
    sourceRoot: [path.join(root, 'src/snippets/ts')]
  }
}

function genData(type, lang) {
  return vscodeGen.generator({
    i18n: lang,
    i18nTpl: '',
    sourceRoot: DATA[type].sourceRoot,
    outFile: null,
    prefix: 'nas',
    separator: '-',
    ingoreDefaultMd: true,
  });
}

Object.keys(DATA).forEach(type => {
  const en = genData(type, 'en-US');
  const zh = genData(type, 'zh-CN');
  Object.keys(en).forEach((key) => {
    if (zh[key] && en[key].description !== zh[key].description) {
      en[key].description += ` (${zh[key].description})`;
    }
  });

  const savePath = path.join(root, `snippets-${type}.json`);
  if (fs.existsSync(savePath)) {
    fs.unlinkSync(savePath);
  }
  fs.writeFileSync(savePath, JSON.stringify(en, null, 2));
});
