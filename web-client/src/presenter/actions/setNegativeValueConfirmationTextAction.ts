import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets props.key on the confirmationText object on state to the NEGATIVE_VALUE_CONFIRMATION_TEXT constant
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setNegativeValueConfirmationTextAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  store.set(
    state.confirmationText[props.key],
    applicationContext.getConstants().NEGATIVE_VALUE_CONFIRMATION_TEXT,
  );
};
