import Gulp from "gulp";

import {
	compileEsNext,
	compileCommonjs,
	compileTestFiles,
} from "./typescript.js";
// import { compileTest } from './test-files.js';

const { watch, series } = Gulp;

const argv = process.argv;
const isProd = argv.includes("--prod");
const doWatch = argv.includes("--watch");
const isTest = argv.includes("--test");

/** Watch modified files */
function watchCb(cb: Function) {
	if (doWatch) {
		watch("src/**/*.ts", compileEsNext);
		watch("src-test/**/*.ts", compileTestFiles);
		// watch('src/app/graphql/schema/**/*.gql', graphQlCompile)
	}
	cb();
}

var tasks: any[];
if (isTest) {
	tasks = [compileCommonjs, compileTestFiles];
} else if (isProd) {
	tasks = [compileEsNext, compileCommonjs, compileTestFiles, watchCb];
} else {
	tasks = [compileEsNext, compileTestFiles, watchCb];
}

export default series(tasks);
