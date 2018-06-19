let fs = require("fs"),
  path = require("path"),
  gulp = require("gulp"),
  concat = require("gulp-concat"),
  wrap = require("gulp-wrap"),
  gulpSequence = require("gulp-sequence"),
  hb = require("gulp-hb"),
  generate = require("./generate");

const DEF = {
  types: [
    {
      name: "html",
      path: ["./src/resources/html/*/*.html", "./src/resources/ng/*/*.html"]
    },
    {
      name: "typescript",
      path: ["./src/resources/ts/*/*.html"]
    }
  ],
  dest: "./snippets/",
  lans: ["zh-CN", "en"],
  defaultLan: "zh-CN"
};

const i18nPath = `./src/i18n/${DEF.defaultLan}.json`;
const i18n = JSON.parse(fs.readFileSync(i18nPath)) || {};

const tasks = [];
for (const t of DEF.types) {
  gulp.task(t.name, () => {
    return gulp
      .src(t.path)
      .pipe(
        generate({
          i18n,
          template: `
    <%=item.point==1?'':',' %> "<%=item.key %>": {
        "prefix": "<%=item.prefix %>",
        "body": "<%=item.escapedContent %>",
        "description": "<%=item.description %>",
        "scope": "<%=item.scope %>"
    }`
        })
      )
      .pipe(concat(t.name + ".json"))
      .pipe(wrap(`{\n <%= contents %>  \n}`, {}, { parse: false }))
      .pipe(gulp.dest(DEF.dest));
  });
  tasks.push(t.name);
}

gulp.task("gen-i18n", () => {
  let snippetJson = JSON.parse(fs.readFileSync(`./snippets.json`)) || {};

  for (let lan of DEF.lans) {
    let filePath = `./src/i18n/${lan}.json`,
      curJson = JSON.parse(fs.readFileSync(filePath)) || {},
      newJson = {};
    for (let key in snippetJson) {
      // category
      let keyArr = key.split(" "),
        categoryKey = keyArr[0],
        curItem = curJson[categoryKey] || { title: "", list: {} };

      if (!newJson[categoryKey]) {
        newJson[categoryKey] = {
          title: curItem.title || "",
          list: {}
        };
      }
      // list
      const newKey = snippetJson[key].prefix;
      newJson[categoryKey].list[newKey] =
        curItem.list[newKey] || snippetJson[key].description;
    }
    let jsonStr = JSON.stringify(newJson, null, "\t");
    fs.writeFileSync(filePath, jsonStr);
  }
});

gulp.task("save-i18n", () => {
  let jsonStr = JSON.stringify(i18n, null, "\t");
  fs.writeFileSync(i18nPath, jsonStr);
});

gulp.task("gen-readme", () => {
  let content = fs.readFileSync(`./src/README.md`),
    i18n =
      JSON.parse(fs.readFileSync(`./src/i18n/${DEF.defaultLan}.json`)) || {};

  gulp
    .src(`./src/README.md`)
    .pipe(
      hb({
        data: {
          i18n: i18n
        }
      })
    )
    .pipe(gulp.dest("./"));
});

tasks.push("save-i18n");
tasks.push("gen-readme");

gulp.task("build", gulpSequence(...tasks));
