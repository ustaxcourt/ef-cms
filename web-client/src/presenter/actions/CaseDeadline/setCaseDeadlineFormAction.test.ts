import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCaseDeadlineFormAction } from './setCaseDeadlineFormAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setCaseDeadlineFormAction', () => {
  it('does not set a caseDeadline on the state.form if props.caseDeadlineId does not match any of the caseDeadlineIds', async () => {
    const result = await runAction(setCaseDeadlineFormAction, {
      modules: { presenter },
      props: {
        caseDeadlineId: 'caseDeadlineId-2',
      },
      state: {
        caseDeadlines: [
          {
            caseDeadlineId: 'caseDeadlineId-1',
            deadlineDate: '2019-07-25T13:03:20.316Z',
            description: 'Case Deadline Description',
          },
        ],
      },
    });

    expect(result.state.form).toBeUndefined();
  });

  it('sets a caseDeadline with id matching props.caseDeadlineId on the state.form', async () => {
    const result = await runAction(setCaseDeadlineFormAction, {
      modules: { presenter },
      props: {
        caseDeadlineId: 'caseDeadlineId-1',
      },
      state: {
        caseDeadlines: [
          {
            caseDeadlineId: 'caseDeadlineId-1',
            deadlineDate: '2019-07-25T13:03:20.316Z',
            description: 'Case Deadline Description',
          },
        ],
      },
    });

    expect(result.state.form).toMatchObject({
      caseDeadlineId: 'caseDeadlineId-1',
      day: '25',
      description: 'Case Deadline Description',
      month: '7',
      year: '2019',
    });
  });
});
