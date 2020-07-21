import { state } from 'cerebral';

/**
 * sets the currentViewMetadata.caseDetail.informationTab to a default value if it is not already set.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function used for getting state from store
 */
export const setDefaultCaseDetailTabAction = ({ get, props, store }) => {
  const frozen = get(state.currentViewMetadata.caseDetail.frozen);

  if (!frozen) {
    store.set(
      state.currentViewMetadata.caseDetail.primaryTab,
      props.primaryTab || 'docketRecord',
    );
    store.set(
      state.currentViewMetadata.caseDetail.inProgressTab,
      'draftDocuments',
    );
    store.set(
      state.currentViewMetadata.caseDetail.caseInformationTab,
      'overview',
    );
    store.set(
      state.currentViewMetadata.caseDetail.docketRecordTab,
      props.docketRecordTab || 'docketRecord',
    );
  }
};
