import { state } from 'cerebral';

export const setNegativeValueConfirmationTextAction = ({
  applicationContext,
  props,
  store,
}) => {
  store.set(
    state.confirmationText[props.key],
    applicationContext.getConstants().NEGATIVE_VALUE_CONFIRMATION_TEXT,
  );
};
