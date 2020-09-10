import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { computeFormDateAction } from './computeFormDateAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computeFormDateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the expected computedDate', async () => {
    applicationContext.getUtilities().checkDate.mockReturnValue('2002-02-01');
    const result = await runAction(computeFormDateAction, {
      modules: {
        presenter,
      },
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

  it('should make a call to the utilities checkDate function', async () => {
    await runAction(computeFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          month: '2',
        },
      },
    });

    expect(applicationContext.getUtilities().checkDate).toHaveBeenCalled();
  });
});
