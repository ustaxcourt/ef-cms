import { state } from 'cerebral';
/**
 * creates the default success alert object
 *
 * @returns {object} the alertSuccess object with default strings
 */
export const getSavePetitionForLaterServiceAlertSuccessAction = ({ get }) => {
  console.log('------not touchin state here', { ...get(state.form.documents) });
  return {
    alertSuccess: {
      message: 'Petition saved for later service.',
    },
  };
};
