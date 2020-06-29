import { computeFormDateAction } from './computeFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeFormDateAction', () => {
  it('should return the expected computedDate', async () => {
    const result = await runAction(computeFormDateAction, {
      state: {
        form: {
          day: '1',
          month: '2',
          year: '2002',
        },
      },
    });

    expect(result.output.computedDate).toEqual('2002-02-01');
  });

  it('should return null if year or day is not defined', async () => {
    const result = await runAction(computeFormDateAction, {
      state: {
        form: {
          month: '2',
        },
      },
    });

    expect(result.output.computedDate).toEqual(null);
  });
});
