import { clearScansAction } from './clearScansAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearScansAction', () => {
  it('should clear the value of state.scanner.batches', async () => {
    const result = await runAction(clearScansAction, {
      state: {
        scanner: {
          batches: {
            property1: true,
            property2: false,
          },
        },
      },
    });

    expect(result.state.scanner.batches).toEqual({});
  });
});
