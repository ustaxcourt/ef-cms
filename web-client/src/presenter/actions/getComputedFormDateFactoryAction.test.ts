import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getComputedFormDateFactoryAction } from './getComputedFormDateFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getComputedFormDateFactoryAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns a computeFormDateAction function', () => {
    expect(
      getComputedFormDateFactoryAction('testPrefix', false),
    ).toBeInstanceOf(Function);
  });

  describe('computeFormDateAction', () => {
    it('computes date parts from generic state.form values if no prefix is given in the outter scope and returns', async () => {
      const result = await runAction(getComputedFormDateFactoryAction(), {
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

      expect(result.output.computedDate).toEqual('2020-01-13T05:00:00.000Z');
    });

    it('computes date parts from the computed state.form values if a prefix is given in the outter scope', async () => {
      const result = await runAction(
        getComputedFormDateFactoryAction('testPrefix'),
        {
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
        },
      );

      expect(result.output.computedDate).toEqual('2021-02-14T05:00:00.000Z');
    });

    it('returns the date in iso string format if toIsoString is given as true in the outter scope', async () => {
      const result = await runAction(
        getComputedFormDateFactoryAction(null, true),
        {
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
        },
      );

      expect(result.output.computedDate).toEqual('2020-01-13T05:00:00.000Z');
    });
  });
});
