const { JSDOM } = require('jsdom');
const path = require('path');
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { scannerStartupAction } from './scannerStartupAction';

const jsdom = new JSDOM(
  '<!DOCTYPE html><html><head></head><body></body></html>',
);
global.document = jsdom.window.document;
global.window = jsdom.window;

const scannerResourcePath = path.join(
  __dirname,
  '../../../../shared/test-assets',
);
presenter.providers.applicationContext = {
  getScannerResourceUri: () => scannerResourcePath,
};

describe('scannerStartupAction', () => {
  it('injects scripts into the dom', async () => {
    const result = await runAction(scannerStartupAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {},
      },
    });

    const dynamScriptClass = result.state.scanner.dynanScriptClass;
    const scriptElements = Array.from(
      document.getElementsByClassName(dynamScriptClass),
    );

    expect(dynamScriptClass).toEqual('dynam-scanner-injection');
    expect(scriptElements.length).toEqual(2);
  });
});
