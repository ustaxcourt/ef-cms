import { state } from 'cerebral';

// export const statisticConfirmationTextHelper = (get, applicationContext) => {
export const statisticConfirmationTextHelper = get => {
  const confirmationText = get(state.confirmationText);
  // 'You are entering a negative value, please confirm before saving';

  // showConfirmationText = !!get(state.statisticWithNegativeValue);

  return confirmationText;
};
