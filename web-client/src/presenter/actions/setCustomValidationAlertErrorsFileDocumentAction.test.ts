import {
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { setCustomValidationAlertErrorsFileDocumentAction } from '@web-client/presenter/actions/setCustomValidationAlertErrorsFileDocumentAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('setCustomValidationAlertErrorsFileDocumentAction', () => {
  it('should set alertError if eventCode is NOTW and user is a private practitioner', async () => {
    const { state } = await runAction(
      setCustomValidationAlertErrorsFileDocumentAction,
      {
        state: {
          form: { eventCode: 'NOTW' },
          user: privatePractitionerUser,
        },
      },
    );
    expect(state.alertError).toEqual({
      title: 'Cannot File Notice of Withdrawal as Counsel',
      message:
        'You must file a Motion to Withdraw as Counsel because of the following: ',
    });
  });
  it('should set alertError if eventCode is NOTW and user is an irs practitioner', async () => {
    const { state } = await runAction(
      setCustomValidationAlertErrorsFileDocumentAction,
      {
        state: {
          form: { eventCode: 'NOTW' },
          user: irsPractitionerUser,
        },
      },
    );
    expect(state.alertError).toEqual({
      title: 'Cannot File Notice of Withdrawal as Counsel',
      message:
        'You must file a Motion to Withdraw as Counsel because of the following: ',
    });
  });
  it('should not set alertError if eventCode is NOTW and user is not a practitioner', async () => {
    const { state } = await runAction(
      setCustomValidationAlertErrorsFileDocumentAction,
      {
        state: {
          form: { eventCode: 'NOTW' },
          user: petitionerUser,
        },
      },
    );
    expect(state.alertError).toBeUndefined();
  });
});
