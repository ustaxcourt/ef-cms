import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseDeadlineFormAction } from './setCaseDeadlineFormAction';

describe('setCaseDeadlineFormAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('should not set a caseDeadline on state.form when a case deadline could not be found using the caseDeadlineId from props', async () => {
    const result = await runAction(setCaseDeadlineFormAction, {
      modules: { presenter },
      props: {
        caseDeadlineId: '99abab1f-f7d1-46cf-b6b7-2d2bca5be301',
      },
      state: {
        caseDeadlines: [
          {
            caseDeadlineId: 'a1d66d94-2dec-4ad1-87f3-b7e694a6ae7d',
            deadlineDate: '2019-07-25T13:03:20.316Z',
            description: 'Case Deadline Description',
          },
        ],
      },
    });

    expect(result.state.form).toBeUndefined();
  });

  it('should set a caseDeadline with id matching props.caseDeadlineId on state.form', async () => {
    const mockCaseDeadlineId = '418bf4eb-aa6d-42ad-a44e-9f54be2ebaa6';

    const result = await runAction(setCaseDeadlineFormAction, {
      modules: { presenter },
      props: {
        caseDeadlineId: mockCaseDeadlineId,
      },
      state: {
        caseDeadlines: [
          {
            caseDeadlineId: mockCaseDeadlineId,
            deadlineDate: '2019-07-25T13:03:20.316Z',
            description: 'Case Deadline Description',
          },
        ],
      },
    });

    expect(result.state.form).toMatchObject({
      caseDeadlineId: mockCaseDeadlineId,
      deadlineDate: '2019-07-25T13:03:20.316Z',
      deadlineDateFormatted: '07/25/19',
      description: 'Case Deadline Description',
    });
  });
});
