import { state } from 'cerebral';

/**
 * sets the wizard step on the form from the passed in props.nextStep
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the passed in props
 * @param {object} providers.store the cerebral store function
 */
export const setWizardStepOnFormAction = ({ props, store }) => {
  store.set(state.form.wizardStep, `${props.nextStep - 1}`);
};
