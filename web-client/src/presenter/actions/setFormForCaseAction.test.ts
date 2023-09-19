import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormForCaseAction } from './setFormForCaseAction';

describe('setFormForCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('retrieves the caseDetail from state if it is not on props', async () => {
    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsNoticeDate: '2019-03-01T21:40:46.415Z',
          isPaper: false,
        },
        form: {},
      },
    });
    expect(result.state.form).toEqual({
      irsDay: '1',
      irsMonth: '3',
      irsYear: '2019',
    });
  });

  it('splits the lastDateOfPeriod into month/day/year fields for statistics', async () => {
    const statistics = [
      {
        lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      },
      {
        year: '2012',
      },
    ];

    const result = await runAction(setFormForCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          statistics,
        },
      },
      state: {
        form: {
          statistics,
        },
      },
    });
    expect(result.state.form.statistics[0]).toMatchObject({
      lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      lastDateOfPeriodDay: '1',
      lastDateOfPeriodMonth: '3',
      lastDateOfPeriodYear: '2019',
    });
    expect(result.state.form.statistics[1]).toEqual({
      year: '2012',
    });
  });
});
