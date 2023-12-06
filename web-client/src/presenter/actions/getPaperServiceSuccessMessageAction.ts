import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns alertSuccess message for paper service
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting the state.alertSuccess
 * @returns {object} alertSuccess with the paper service success message
 */
export const getPaperServiceSuccessMessageAction = ({ get }: ActionProps) => {
  const currentAlertSuccess = get(state.alertSuccess);
  if (!currentAlertSuccess || currentAlertSuccess.overwritable !== false) {
    return {
      alertSuccess: {
        message: 'Your entry has been added to the docket record.',
      },
    };
  } else {
    return { alertSuccess: { message: currentAlertSuccess.message } };
  }
};
