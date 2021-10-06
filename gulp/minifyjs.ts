/** Wrapper for Terser */
import { minify } from 'terser';
import type VinylFile from 'vinyl';
import Through from 'through2';

export function minifyJs() {
	return Through.obj(async function (file: VinylFile, _, cb) {
		var err: any = null;
		try {
			const p = file.path;
			let c: number, c2: number;
			let ext: string;
			if (
				file.isBuffer() === false ||
				(c = p.lastIndexOf('.')) === -1 ||
				((c2 = p.lastIndexOf('.', c - 1)) !== -1 && p.substr(c2, 2) === '.d')
			) { }
			else if (
				(ext = p.substr(c)) === '.js' ||
				ext === '.mjs' ||
				ext === '.cjs'
			) {
				const code = (await minify(file.contents!.toString())).code;
				if (code == null) throw 0;
				file.contents = Buffer.from(code);
			}
		} catch (e: any) {
			err = new Error(`Minify failed: ${file.path}.\nCaused by:${e?.stack ?? e}\n`);
		}
		cb(err, file);
	});
}