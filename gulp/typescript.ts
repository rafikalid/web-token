/**
 * Compile Typescript files
 */
import Gulp from "gulp";
import GulpTypescript from "gulp-typescript";
import SrcMap from "gulp-sourcemaps";
import { Converter } from "typescript-path-fix";
import GulpRename from "gulp-rename";
import { minifyJs } from "./minifyjs";

const { src, dest, lastRun } = Gulp;
// import {transform} from 'ts-transform-import-path-rewrite'

const isProd = process.argv.includes("--prod");

const tsPathFix = new Converter("tsconfig.json");

const TsProject = GulpTypescript.createProject("tsconfig.json", {
	removeComments: isProd,
	pretty: !isProd,
	target: "ESNext",
	module: "ESNext",
});
const TsProjectCommonjs = GulpTypescript.createProject("tsconfig.json", {
	removeComments: isProd,
	pretty: !isProd,
	target: "ES2015",
	module: "CommonJS",
});

const TsProjectTest = GulpTypescript.createProject("tsconfig.json", {
	removeComments: isProd,
	pretty: !isProd,
	target: "ES2015",
	module: "CommonJS",
});

/** Compile as EsNext */
export function compileEsNext() {
	var glp: NodeJS.ReadWriteStream = src("src/**/*.ts", {
		nodir: true,
		since: lastRun(compileEsNext),
	})
		.pipe(SrcMap.init())
		.pipe(TsProject())
		.pipe(tsPathFix.gulp(".mjs"))
		.pipe(GulpRename({ extname: ".mjs" }));
	if (isProd)
		glp = glp.pipe(minifyJs());
	return glp.pipe(SrcMap.write("."))
		.pipe(dest("dist/module"));
}

/** Compile as Commonjs */
export function compileCommonjs() {
	var glp: NodeJS.ReadWriteStream = src("src/**/*.ts", {
		nodir: true,
		since: lastRun(compileCommonjs),
	})
		.pipe(SrcMap.init())
		.pipe(tsPathFix.gulp())
		.pipe(TsProjectCommonjs())
	if (isProd)
		glp = glp.pipe(minifyJs());
	return glp.pipe(SrcMap.write("."))
		.pipe(dest("dist/commonjs"));
}

/** Compile test files */
export function compileTestFiles() {
	return src("src-test/**/*.ts", {
		nodir: true,
		since: lastRun(compileTestFiles),
	})
		.pipe(SrcMap.init())
		.pipe(TsProjectTest())
		.pipe(tsPathFix.gulp())
		.pipe(SrcMap.write("."))
		.pipe(dest("test"));
}
