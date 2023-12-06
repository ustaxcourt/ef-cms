import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.wizardStep to the props.value passed in.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const chooseModalWizardStepAction = ({ props, store }: ActionProps) => {
  store.set(state.modal.wizardStep, props.value);
};
