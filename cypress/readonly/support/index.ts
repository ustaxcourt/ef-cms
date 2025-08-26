import '../../support/commands';

before(() => {
  // Set bail behavior for the entire test suite
  const ctx = (cy as any).state('runnable')?.ctx as Mocha.Context;
  if (ctx?.currentTest?.parent) {
    ctx.currentTest.parent.bail(true);
  }
});
