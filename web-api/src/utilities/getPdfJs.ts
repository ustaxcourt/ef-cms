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
