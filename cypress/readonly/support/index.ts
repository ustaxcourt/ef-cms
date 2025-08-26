import '../../support/commands';

afterEach(function () {
  const currentTest = (this as Mocha.Context | undefined)?.currentTest;
  if (currentTest && currentTest.state === 'failed') {
    const ctx = (cy as any).state('runnable')?.ctx as Mocha.Context;
    if (ctx?.currentTest?.parent) {
      ctx.currentTest.parent.bail(true);
    }
  }
});
