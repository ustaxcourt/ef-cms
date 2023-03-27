/* eslint-disable complexity */
// import { state } from 'cerebral';

// export const statisticConfirmationTextHelper = (get, applicationContext) => {
export const statisticConfirmationTextHelper = (get, applicationContext) => {
  const NEGATIVE_NUMBER_CONFIRMATION_TEXT =
    'You are entering a negative value, please confirm before saving';

  let showConfirmationText = true;

  // showConfirmationText = !!get(state.statisticWithNegativeValue);

  return { NEGATIVE_NUMBER_CONFIRMATION_TEXT, showConfirmationText };
};
