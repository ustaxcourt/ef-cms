import { state } from 'cerebral';

export const unsetNegativeValueConfirmationTextAction = ({ props, store }) => {
  store.unset(state.confirmationText[props.key]);
};
