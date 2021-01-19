import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getCaseDeadlineFromFormAction', () => {
  const computedDateFromProps = '2020-01-01T05:00:00.000Z';
  const mockJudge = 'Buch';
  const mockDocketNumber = '105-20';

  it.only('returns a caseDeadline with props.comptedDate and form values', async () => {
    const result = await runAction(getCaseDeadlineFromFormAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: computedDateFromProps,
      },
      state: {
        caseDetail: {
          associatedJudge: mockJudge,
          docketNumber: mockDocketNumber,
        },
        form: {
          day: 5,
          month: 2,
          searchError: {},
          year: 1993,
        },
      },
    });

    expect(result.output).toEqual({
      associatedJudge: mockJudge,
      deadlineDate: computedDateFromProps,
      docketNumber: mockDocketNumber,
    });
  });

  it('gets all case deadlines with a page from state.caseDeadlineReport.page', async () => {
    await runAction(getCaseDeadlineFromFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDeadlineReport: {
          page: 3,
        },
        screenMetadata: {
          filterEndDate: END_DATE,
          filterStartDate: computedDateFromProps,
        },
      },
    });
    expect(
      applicationContext.getUseCases().getCaseDeadlinesInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      page: 3,
    });
  });
});
