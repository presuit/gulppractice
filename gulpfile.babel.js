import gulp from "gulp";
import gPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gimg from "gulp-image";
import gsass from "gulp-sass";
import gautoprefixer from "gulp-autoprefixer";
import gcsso from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

gsass.compiler = require("node-sass");

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build",
    },
    img: {
        src: "src/img/*",
        dest: "build/img",
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css",
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js",
    },
};

const img = () => gulp.src(routes.img.src).pipe(gimg()).pipe(gulp.dest(routes.img.dest));

const pug = () => gulp.src(routes.pug.src).pipe(gPug()).pipe(gulp.dest(routes.pug.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(gsass().on("error", gsass.logError))
        .pipe(
            gautoprefixer({
                cascade: false,
            })
        )
        .pipe(gcsso())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [babelify.configure({ presets: ["@babel/preset-env"] }), ["uglifyify", { global: true }]],
            })
        )
        .pipe(gulp.dest(routes.js.dest));

const clean = () => del(["build"]);

const webserver = () => gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

// build
const prepare = gulp.series([clean, img]);
// assets
const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
