import { printFromBrowserAction } from './printFromBrowserAction';
import { runAction } from 'cerebral/test';

describe('printFromBrowserAction', () => {
  let printFromWindowStub;

  beforeEach(() => {
    printFromWindowStub = jest.fn();

    global.window = global;
    global.window.print = printFromWindowStub;
  });

  it('prints from the browser', async () => {
    await runAction(printFromBrowserAction);

    expect(printFromWindowStub).toHaveBeenCalled();
  });
});
