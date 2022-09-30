const { src, dest, series, parallel, watch } = require("gulp");
const htmlmin = require("gulp-htmlmin");
var concat = require("gulp-concat");
var cleanss = require("gulp-cleancss");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const replace = require("gulp-replace");
const removeDuplicateLines = require("gulp-remove-duplicate-lines");

var globs = {
   html: "./project/*.html",
   css: "project/css/**/*.css",
   js: "./project/js/**/*.js",
   imgs: "project/pics/*",
};

function htmlTask() {
   return (
      //read
      src(globs.html)
         .pipe(replace(/(css\/)+([a-z])\w+.css/g, "./assets/style.min.css"))
         .pipe(
            replace(
               /(.\/css\/)+([a-z])\w+\/+([a-z])\w+.css/g,
               "./assets/style.min.css"
            )
         )
         .pipe(removeDuplicateLines({ include: /\<link/g }))
         .pipe(replace("pics", "assets/imgs"))
         //minify
         .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
         //dist folder
         .pipe(dest("dist"))
   );
}
exports.html = htmlTask;

//css
function cssTask() {
   return src(globs.css)
      .pipe(concat("style.min.css"))
      .pipe(cleanss())
      .pipe(dest("dist/assets"));
}

exports.css = cssTask;

//JS
function jsTask() {
   return src(globs.js)
      .pipe(concat("script.min.js"))
      .pipe(terser())
      .pipe(dest("dist/assets"));
}

exports.js = jsTask;

//imgs
function imgsTask() {
   return src(globs.imgs).pipe(imagemin()).pipe(dest("dist/assets/imgs"));
}

exports.imgs = imgsTask;

function watchTask() {
   watch(globs.html, htmlTask);
   watch(globs.css, cssTask);
   watch(globs.js, jsTask);
}

exports.default = series(parallel(htmlTask, cssTask, jsTask, imgsTask));
