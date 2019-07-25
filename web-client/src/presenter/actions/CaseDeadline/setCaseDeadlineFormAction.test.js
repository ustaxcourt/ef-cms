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
