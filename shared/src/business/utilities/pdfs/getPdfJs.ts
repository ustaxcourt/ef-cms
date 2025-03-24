/*
  ____          _____                __       _ 
 |  _ \        / ____|              / _|     | |
 | |_) | ___  | |     __ _ _ __ ___| |_ _   _| |
 |  _ < / _ \ | |    / _` | '__/ _ \  _| | | | |
 | |_) |  __/ | |___| (_| | | |  __/ | | |_| | |
 |____/ \___|  \_____\__,_|_|  \___|_|  \__,_|_|

Be careful here. pdfjs-dist is not a typical dependency and requires bundling + browser configuration to use.
Both the frontend (browser) and backend (node) use this function to get pdfjs-dist and this function has been simplified as much as possible.
This function code splits the dependency, initializes the worker correctly, works in a node environment, and has backward compatibility with older browser versions.
If you are going to change this function know you must keep all the above in mind.

The most difficult part of upgrading is correctly bundling the worker files. You must manually include the worker in your output bundle for lambdas and browser.
This means copying a file from node_modules into the bundle.
Both web-api/terraform/modules/lambda/esbuildLambda.mjs and ./esbuildHelper.mjs need to point at the worker in node_modules for this package to work.
*/
export async function getPdfJs(): Promise<typeof pdfJs> {
  const pdfJs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfJs.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
  return pdfJs;
}

/*
This function exists to check for support for es2022 as modern of pdfjs-dist will not work on older browsers.
We are using the legacy version of pdfjs-dist so this should not be an issue, but wanted to keep this function around
in case we decide to switch to a modern version of pdfs-dist. 
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function clientSupportsES2022(): boolean {
  try {
    // Check Object.hasOwn (introduced in ES2022)
    // @ts-ignore
    if (typeof Object.hasOwn !== 'function') {
      return false;
    }

    // Check structuredClone exists
    if (typeof structuredClone !== 'function') {
      return false;
    }

    // Check Array.prototype.at
    if (!Array.prototype.at) {
      return false;
    }

    // Check private fields
    class TestPrivateFields {
      #privateField: boolean;
      constructor() {
        this.#privateField = true;
      }
      hasPrivateField() {
        return this.#privateField;
      }
    }
    const instance = new TestPrivateFields();
    if (!instance.hasPrivateField()) {
      return false;
    }

    return true;
  } catch (e) {
    return false; // Any failure indicates lack of support
  }
}
