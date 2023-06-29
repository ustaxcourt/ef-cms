import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSessionWorkingCopy
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setTrialSessionWorkingCopyKeyAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.trialSessionWorkingCopy[props.key], props.value);
};
