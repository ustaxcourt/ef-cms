import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setFormCaseStatusToInProgressAction } from './setFormCaseStatusToInProgressAction';

describe('setFormCaseStatusToInProgressAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the case status in the form to In Progress', async () => {
    const result = await runAction(setFormCaseStatusToInProgressAction, {
      modules: { presenter },
    });

    expect(result.state).toMatchObject({
      form: {
        status: applicationContext.getEntityConstructors().Case.STATUS_TYPES
          .inProgress,
      },
    });
  });
});
