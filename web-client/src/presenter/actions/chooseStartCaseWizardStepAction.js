import { state } from 'cerebral';

/**
 * setup the state for the start case wizard
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const chooseStartCaseWizardStepAction = ({ props, store }) => {
  store.set(state.wizardStep, props.value);
  store.set(state.form.wizardStep, props.step);
};
