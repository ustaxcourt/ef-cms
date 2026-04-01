import { ROLES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';
export const setCustomValidationAlertErrorsFileDocumentAction = ({
  get,
  store,
}) => {
  const form = get(state.form);
  const user = get(state.user);

  if (
    form.eventCode === 'NOTW' &&
    (user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner)
  ) {
    const alertError = {
      ...get(state.alertError),
      title: 'Cannot File Notice of Withdrawal as Counsel',
      message:
        'You must file a Motion to Withdraw as Counsel because of the following:',
    };
    store.set(state.alertError, alertError);
  }
};
