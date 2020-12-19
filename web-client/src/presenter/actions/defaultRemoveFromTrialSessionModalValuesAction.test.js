import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { defaultRemoveFromTrialSessionModalValuesAction } from './defaultRemoveFromTrialSessionModalValuesAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('defaultRemoveFromTrialSessionModalValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { STATUS_TYPES } = applicationContext.getConstants();

  it('should default the state.modal values for the remove trial session modal to the state.caseDetail values', async () => {
    const result = await runAction(
      defaultRemoveFromTrialSessionModalValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          trialSessionId: 'abc-123',
        },
        state: {
          caseDetail: {
            associatedJudge: 'Guy Fieri',
            status: STATUS_TYPES.assignedCase,
          },
          modal: {},
        },
      },
    );

    expect(result.state.modal).toMatchObject({
      associatedJudge: 'Guy Fieri',
      caseStatus: STATUS_TYPES.generalDocketReadyForTrial,
    });
  });
});
