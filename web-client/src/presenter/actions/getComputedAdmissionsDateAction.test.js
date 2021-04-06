import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getComputedAdmissionsDateAction } from './getComputedAdmissionsDateAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getComputedAdmissionsDateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  describe('getComputedAdmissionsDateAction', () => {
    it.only('returns computed date parts from generic state.form values', async () => {
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

    it('computes date parts from the computed state.form values if a prefix is given in the outter scope', async () => {
      const result = await runAction(getComputedAdmissionsDateAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            day: '13', // should ignore
            month: '01', // should ignore
            testPrefixDay: '14',
            testPrefixMonth: '02',
            testPrefixYear: '2021',
            year: '2020', // should ignore
          },
        },
      });

      expect(result.output.computedDate).toEqual('2021-02-14T05:00:00.000Z');
    });

    it('returns the date in iso string format if toIsoString is given as true in the outter scope', async () => {
      const result = await runAction(getComputedAdmissionsDateAction, {
        modules: {
          presenter,
        },
        state: {
          form: {
            day: '13',
            month: '1',
            year: '2020',
          },
        },
      });

      expect(result.output.computedDate).toEqual('2020-01-13T05:00:00.000Z');
    });
  });
});
