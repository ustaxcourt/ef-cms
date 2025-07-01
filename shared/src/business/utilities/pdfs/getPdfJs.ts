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
This function exists to check for support for es2022 as modern versions of pdfjs-dist will not work on older browsers.
We are using the legacy version of pdfjs-dist so this should not be an issue, but wanted to keep this function around
in case we decide to switch to a modern version of pdfs-dist. 
*/
export function clientSupportsES2022(): boolean {
  // Check for ES2022 features that are commonly used in pdfjs-dist
  try {
    // Hard-block Safari <16.4 due to partial ES2022 support
    // Defensive check for user agent

    const ua = navigator?.userAgent;
    if (!ua || typeof ua !== 'string' || ua.trim() === '') {
      console.warn(
        'User agent is empty or invalid, assuming unsupported browser',
      );
      return false;
    }

    const safariMatch = ua.match(/Safari/);
    if (safariMatch && !ua.includes('Chrome') && !ua.includes('Chromium')) {
      try {
        const versionMatch = ua.match(/Version\/(\d+)\.(\d+)/);
        if (versionMatch) {
          const majorVersion = parseInt(versionMatch[1], 10);
          const minorVersion = parseInt(versionMatch[2], 10);

          // Check if version parsing was successful
          if (isNaN(majorVersion) || isNaN(minorVersion)) {
            console.warn(
              'Could not parse Safari version, assuming unsupported',
            );
            return false;
          }

          // Safari must be 16.0 or higher
          if (majorVersion < 16) {
            console.warn(
              `Safari ${majorVersion}.${minorVersion} is below minimum version 16.0`,
            );
            return false;
          }
        } else {
          console.warn(
            'Could not find Safari version in user agent, assuming unsupported',
          );
          return false;
        }
      } catch (error) {
        console.error('Error parsing Safari user agent:', error);
        return false;
      }
    }
    // Basic ES2022 feature checks
    // @ts-ignore
    if (typeof Object.hasOwn !== 'function') return false;
    if (typeof structuredClone !== 'function') return false;
    if (!Array.prototype.at) return false;

    // This is safe: we're using new Function only to test ES2022 syntax support
    // Safari 15.6 (on macOS Catalina and Big Sur) presents a unique issue:
    //   - It *partially* supports ES2022 features like private class fields (`#field`)
    //   - It does *not* fully support private class methods or certain expressions involving them
    //   - Critically, it does not fail until *parse time*, meaning these features cannot be caught with simple runtime checks
    // This stricter `new Function(...)` syntax check ensures:
    //   - The browser can fully parse and execute private fields + private methods
    //   - Any unsupported browser (e.g., Safari <=15.6) fails early with a SyntaxError
    //   - Prevents hard crashes when loading modern libraries like pdfjs-dist@5.x that use ES2022 syntax
    //
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(`
      class AggressiveTest {
        #field = 1;
        #double(x) { return x * 2; }
        #process() {
          const result = this.#double(this.#field);
          if (result !== 2) throw new Error("bad math");
        }
        run() {
          const fn = () => this.#process();
          return fn();
        }
      }
      new AggressiveTest().run();
    `)();

    return true;
  } catch (e) {
    console.warn('ES2022 support check failed:', e);
    return false; // Any failure indicates lack of support
  }
}
