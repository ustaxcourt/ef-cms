import { state } from 'cerebral';

export const unsetNegativeValueConfirmationTextAction = ({ props, store }) => {
  console.log('props in unSetter****', props);
  store.unset(state.confirmationText[props.key]);
};
