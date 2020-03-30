import { JSDOM } from 'jsdom';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { scannerStartupAction } from './scannerStartupAction';

const jsdom = new JSDOM(
  '<!DOCTYPE html><html><head></head><body></body></html>',
);
global.document = jsdom.window.document;
global.window = jsdom.window;

describe('scannerStartupAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('injects scripts into the dom', async () => {
    const result = await runAction(scannerStartupAction, {
      modules: {
        presenter,
      },
      state: {
        scanner: {},
      },
    });

    const { dynamScriptClass } = result.state.scanner;

    expect(dynamScriptClass).toEqual('dynam-scanner-injection');
  });
});
