let fs = require("fs"),
  gulp = require("gulp"),
  concat = require("gulp-concat"),
  wrap = require("gulp-wrap"),
  hb = require("gulp-hb"),
  generate = require("./generate");

const DEF = {
  types: {
    html: ["./src/resources/html/*/*.html", "./src/resources/ng/*/*.html"],
    ts: ["./src/resources/ts/*/*.html"]
  },
  dest: "./snippets/",
  lans: ["zh-CN", "en"],
  defaultLan: "zh-CN"
};

const i18n =
  JSON.parse(fs.readFileSync(`./src/i18n/${DEF.defaultLan}.json`)) || {};
const lans = {};
lans[DEF.defaultLan] = i18n;
DEF.lans.filter(w => w !== DEF.defaultLan).forEach(lan => {
  lans[lan] = JSON.parse(fs.readFileSync(`./src/i18n/${lan}.json`)) || {};
});

const tasks = [];
Object.keys(DEF.types).forEach(name => {
  const taskName = `gen-${name}`;
  gulp.task(taskName, () => {
    return gulp
      .src(DEF.types[name])
      .pipe(
        generate({
          i18n,
          lans,
          template: `
    <%=item.point==1?'':',' %> "<%=item.key %>": {
        "prefix": "<%=item.prefix %>",
        "body": "<%=item.escapedContent %>",
        "description": "<%=item.description %>",
        "scope": "<%=item.scope %>"
    }`
        })
      )
      .pipe(concat(name + ".json"))
      .pipe(wrap(`{\n <%= contents %>  \n}`, {}, {
        parse: false
      }))
      .pipe(gulp.dest(DEF.dest));
  });
  tasks.push(taskName);
});

gulp.task("watch-html", () => {
  gulp.watch(DEF.types.html, ["gen-html"]);
});

gulp.task("watch-ts", () => {
  gulp.watch(DEF.types.ts, ["gen-ts"]);
});

gulp.task("gen-i18n", (done) => {
  function genBySnippetJson(type, newJson, curJson) {
    let snippetJson =
      JSON.parse(fs.readFileSync(`./snippets/${type}.json`)) || {};
    for (let key in snippetJson) {
      // category
      let keyArr = key.split(" "),
        categoryKey = keyArr[0],
        curItem = curJson[categoryKey] || {
          title: "",
          list: {}
        };

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
  }

  for (let lan of DEF.lans) {
    let filePath = `./src/i18n/${lan}.json`,
      curJson = JSON.parse(fs.readFileSync(filePath)) || {},
      newJson = {};
    genBySnippetJson("html", newJson, curJson);
    genBySnippetJson("ts", newJson, curJson);
    let jsonStr = JSON.stringify(newJson, null, "\t");
    fs.writeFileSync(filePath, jsonStr);
  }

  done();
});

gulp.task("gen-readme", () => {
  return gulp
    .src(`./src/README.zh-CN.md`)
    .pipe(
      hb({
        data: {
          i18n: lans["zh-CN"]
        }
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("gen-readme-en", () => {
  return gulp
    .src(`./src/README.md`)
    .pipe(
      hb({
        data: {
          i18n: lans["en"]
        }
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("build", gulp.series(...tasks));

gulp.task("serve", gulp.series("build", "gen-i18n", "watch-html", "watch-ts"));

gulp.task("prod", gulp.series("build", "gen-i18n", "gen-readme", "gen-readme-en"));
