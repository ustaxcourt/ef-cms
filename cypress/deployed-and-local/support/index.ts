import { mockDynamsoftLibrary } from 'cypress/helpers/authentication/dynamsoft';
import '../../support/commands';

before(() => {
  // Set bail behavior for the entire test suite
  console.log('Setting up fail-fast behavior for test suite');
  const ctx = (cy as any).state('runnable')?.ctx as Mocha.Context;
  if (ctx?.currentTest?.parent) {
    console.log('Calling bail(true) to enable fail-fast');
    ctx.currentTest.parent.bail(true);
  } else {
    console.log('Could not access test parent context in before hook');
  }
});

beforeEach(() => {
  mockDynamsoftLibrary();
});
