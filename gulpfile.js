const { src, dest, series, watch } = require("gulp");

// styles
const scss = require("gulp-sass")(require("sass"));
const autoPrefixer = require("gulp-autoprefixer");
const cssMinify = require("gulp-clean-css");

function styles() {
	return src("./src/sass/**/*.scss")
		.pipe(scss())
		.pipe(autoPrefixer("last 2 versions"))
		.pipe(cssMinify())
		.pipe(dest("./dist/styles/"));
}

// scripts
const jsMinify = require("gulp-terser");

function scripts() {
	return src("./src/scripts/app.js")
		.pipe(jsMinify())
		.pipe(dest("./dist/scripts/"));
}

function watchTask() {
	watch(
		["./src/sass/**/*.scss", "./src/scripts/app.js"],
		series(styles, scripts)
	);
}

exports.default = series(styles, scripts, watchTask);
