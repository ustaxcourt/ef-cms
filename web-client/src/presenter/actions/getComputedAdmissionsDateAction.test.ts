import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getComputedAdmissionsDateAction } from './getComputedAdmissionsDateAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getComputedAdmissionsDateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns computed date parts from generic state.form values', async () => {
    const result = await runAction(getComputedAdmissionsDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          day: '13',
          month: '01',
          year: '2020',
        },
      },
    });

    expect(result.output.computedDate).toEqual('2020-01-13');
  });

  it('computes a correct date if given a day past the inputed month', async () => {
    const result = await runAction(getComputedAdmissionsDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          day: '3',
          month: '2',
          year: '2020',
        },
      },
    });

    expect(result.output.computedDate).toEqual('2020-02-03');
  });

  it('returns computed date parts from generic state.form values', async () => {
    const result = await runAction(getComputedAdmissionsDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          day: '13',
          month: '01',
        },
      },
    });

    expect(result.output.computedDate).toEqual(null);
  });

  it('returns null if state.form is empty', async () => {
    const result = await runAction(getComputedAdmissionsDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.output.computedDate).toEqual(null);
  });
});
