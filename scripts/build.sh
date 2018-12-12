#!/usr/bin/env bash

set -u -e -o pipefail

cd $(dirname $0)/..

PUBLISH=false
for ARG in "$@"; do
  case "$ARG" in
    -p)
      PUBLISH=true
      ;;
  esac
done

buildSnippetByLang() {
  LANG="$1"
  (
    local filePrefix="-${LANG}"
    local i18nTpl=""
    if [[ $LANG == "" ]]; then
      filePrefix=""
      i18nTpl="{zh-CN}({en-US})"
    fi
    # html
    $(npm bin)/vscode-snippet-generator --i18n=${LANG} --sourceRoot=src/snippets/html,src/snippets/ng --outFile=snippets/html${filePrefix}.json --i18nTpl=${i18nTpl}
    # ts
    $(npm bin)/vscode-snippet-generator --i18n=${LANG} --sourceRoot=src/snippets/ts --outFile=snippets/ts${filePrefix}.json --i18nTpl=${i18nTpl}
  )
}

buildSnippet() {
  echo "Build snippets..."
  rm -rf ./snippets
  mkdir -p ./snippets

  # build single language
  buildSnippetByLang "zh-CN"
  buildSnippetByLang "en-US"
}

buildClass() {
  echo "Build class names..."
  $(npm bin)/tsc -p ./
}

packingByLang() {
  LANG="$1"
  (
    local prefix="-${LANG}"
    if [[ $LANG == "" ]]; then
      prefix=""
    fi

    echo "Packing version: ${LANG}"
    node ./scripts/package.js ${LANG}
    cp snippets/html${prefix}.json ./snippets-html.json
    cp snippets/ts${prefix}.json ./snippets-ts.json
    $(npm bin)/vsce package -o cipchk.ng-alain-vscode${prefix}.vsix
  )
}

packing() {
  packingByLang "zh-CN"

  packingByLang "en-US"
}

buildSnippet
buildClass
packing

if [[ ${PUBLISH} == true ]]; then
  echo 'Publicsh...'
  # $(npm bin)/vsce publish --packagePath ./cipchk.ng-alain-vscode-en-US.vsix
  # $(npm bin)/vsce publish --packagePath ./cipchk.ng-alain-vscode-zh-CN.vsix
fi