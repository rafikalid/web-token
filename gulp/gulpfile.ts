import Gulp from 'gulp';

import {typescriptCompile} from './typescript.js';

const {watch, series}= Gulp;

const argv= process.argv;
const isProd= argv.includes('--prod');
const doWatch= argv.includes('--watch');

/** Watch modified files */
function watchCb(cb: Function){
	if(doWatch){
		watch('src/**/*.ts', typescriptCompile);
	}
	cb();
}

export default series([
	typescriptCompile,
	watchCb
]);
