import { printViewAction } from './printViewAction';
import { runAction } from 'cerebral/test';

const mockPrint = jest.fn();

describe('printViewAction', () => {
  it('should change state.currentPage to the specified printView', async () => {
    global.window = {
      print: mockPrint,
    };
    const result = await runAction(printViewAction, {
      props: {
        printView: 'testViewPrint',
      },
      state: {
        currentPage: 'testView',
      },
    });

    expect(result.state.currentPage).toEqual('testViewPrint');
  });
  it('should change the view back to the referred view', async () => {
    global.window = {
      print: mockPrint,
    };
    const result = await runAction(printViewAction, {
      props: {
        printView: 'testViewPrint',
      },
      state: {
        currentPage: 'testView',
      },
    });

    setTimeout(() => {
      expect(result.state.currentPage).toEqual('testView');
    });
  });
  it('should call window.print()', async () => {
    global.window = {
      print: mockPrint,
    };
    await runAction(printViewAction, {
      props: {
        printView: 'testViewPrint',
      },
      state: {
        currentPage: 'testView',
      },
    });

    setTimeout(() => {
      expect(mockPrint).toHaveBeenCalled();
    });
  });
});
