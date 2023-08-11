import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseDeadlineFromFormAction', () => {
  const computedDateFromProps = '2020-01-01T05:00:00.000Z';
  const mockJudge = 'Buch';
  const mockDocketNumber = '105-20';

  presenter.providers.applicationContext = applicationContext;

  it('should not include deadlineDate in the caseDeadline when props.computedDate is undefined', async () => {
    const result = await runAction(getCaseDeadlineFromFormAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: undefined,
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

    expect(result.output.deadlineDate).toBeUndefined();
  });

  it('returns a caseDeadline with props.computedDate and form values when props.computedDeadline is defined', async () => {
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
          leadDocketNumber: mockDocketNumber,
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
      leadDocketNumber: mockDocketNumber,
    });
  });

  it('returns a caseDeadline with props.computedDate and form values when props.computedDeadline is defined when case does not have a leadDocketNumber', async () => {
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
          leadDocketNumber: undefined,
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
});
