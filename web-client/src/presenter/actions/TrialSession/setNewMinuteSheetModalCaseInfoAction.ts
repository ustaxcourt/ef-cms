import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the case info on the modal state after successful validation
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing caseInfo
 * @param {object} providers.store the cerebral store
 */
export const setNewMinuteSheetModalCaseInfoAction = ({
  props,
  store,
}: ActionProps) => {
  const { caseInfo } = props;

  store.set(state.modal.caseInfo, caseInfo);
};
