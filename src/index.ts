import { toJS, resolve } from './util';
import { Document } from './document';

import type { AsyncAPIObject } from './spec-types';

/**
 *
 * @param {string[]} files Array of stringified AsyncAPI documents in YAML format, that are to be bundled (or array of filepaths, resolved and passed via `Array.map()` and `fs.readFileSync`, which is the same, see `README.md`).
 * @param {Object} [options]
 * @param {string | object} [options.base] Base object whose properties will be retained.
 * @param {boolean} [options.referenceIntoComponents] Pass `true` to resolve external references to components.
 *
 * @return {Document}
 *
 * @example
 *
 * import { readFileSync, writeFileSync } from 'fs';
 * import bundle from '@asyncapi/bundler';
 *
 * async function main() {
 *   const document = await bundle([readFileSync('./main.yaml', 'utf-8')], {
 *     referenceIntoComponents: true,
 *   });
 *
 *   console.log(document.yml()); // the complete bundled AsyncAPI document
 *   writeFileSync('asyncapi.yaml', document.yml());  // the complete bundled AsyncAPI document
 * }
 *
 * main().catch(e => console.error(e));
 *
 */
export default async function bundle(files: string[], options: any = {}) {
  if (typeof options.base !== 'undefined') {
    options.base = toJS(options.base);
  }

  const parsedJsons = files.map(file => toJS(file)) as AsyncAPIObject[];

  /**
   * Bundle all external references for each file.
   */
  const resolvedJsons = await resolve(parsedJsons, {
    referenceIntoComponents: options.referenceIntoComponents,
  });

  return new Document(resolvedJsons as AsyncAPIObject[], options.base);
}

export { Document };
