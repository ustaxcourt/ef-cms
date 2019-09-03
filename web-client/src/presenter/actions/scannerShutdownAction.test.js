import { JSDOM } from 'jsdom';
import { runAction } from 'cerebral/test';
import { scannerShutdownAction } from './scannerShutdownAction';

const dynamScriptClass = 'dynam-scanner-injection';

const jsdom = new JSDOM(
  `<!DOCTYPE html><html><head><script class="${dynamScriptClass}"></script><script class="${dynamScriptClass}"></script></head><body></body></html>`,
);

global.document = jsdom.window.document;
global.window = jsdom.window;

describe('scannerShutdownAction', () => {
  it('removes injected scanner scripts', async () => {
    await runAction(scannerShutdownAction, {
      state: {
        scanner: {
          dynanScriptClass: dynamScriptClass,
        },
      },
    });
    const scriptElements = Array.from(
      document.getElementsByClassName(dynamScriptClass),
    );
    expect(scriptElements.length).toEqual(0);
  });

  it('sets the scanner init and config script load states to false', async () => {
    const result = await runAction(scannerShutdownAction, {
      state: {
        scanner: {
          configScriptLoaded: true,
          initiateScriptLoaded: true,
        },
      },
    });

    expect(result.state.scanner.configScriptLoaded).toEqual(false);
    expect(result.state.scanner.initiateScriptLoaded).toEqual(false);
  });
});
