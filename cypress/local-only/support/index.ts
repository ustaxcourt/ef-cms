import './commands';
import '@cypress/puppeteer/support';
import 'cypress-axe';
import { mockDynamsoftLibrary } from 'cypress/helpers/authentication/dynamsoft';

beforeEach(() => {
  mockDynamsoftLibrary();
});

afterEach(function () {
  const currentTest = (this as Mocha.Context | undefined)?.currentTest;
  if (currentTest && currentTest.state === 'failed') {
    const ctx = (cy as any).state('runnable')?.ctx as Mocha.Context;
    if (ctx?.currentTest?.parent) {
      ctx.currentTest.parent.bail(true);
    }
  }
});
