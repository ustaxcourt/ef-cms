import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setCaseDeadlineFormAction } from './setCaseDeadlineFormAction';

describe('setCaseDeadlineFormAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns a caseDeadline', async () => {
    const result = await runAction(setCaseDeadlineFormAction, {
      modules: { presenter },
      props: {
        caseDeadlineId: 'caseDeadlineId-1',
      },
      state: {
        caseDeadlines: [
          {
            caseDeadlineId: 'caseDeadlineId-1',
            deadlineDate: new Date().toISOString(),
            description: 'Case Deadline Description',
          },
        ],
      },
    });

    expect(result.state.form).toBeDefined();
    expect(result.state.form).toBeTruthy();
  });
});
