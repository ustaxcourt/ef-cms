import { state } from 'cerebral';

/**
 * sets the currentViewMetadata.caseDetail.informationTab to a default value if it is not already set.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.get the cerebral get function used for getting state from store
 */
export const setDefaultCaseDetailTabAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { PARTY_VIEW_TABS } = applicationContext.getConstants();
  const frozen = get(state.currentViewMetadata.caseDetail.frozen);

  // TODO: what is a better name for this; we are not sure what frozen means
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
      props.caseInformationTab || 'overview',
    );
    store.set(
      state.currentViewMetadata.caseDetail.docketRecordTab,
      props.docketRecordTab || 'docketRecord',
    );

    const partyViewTab = get(state.currentViewMetadata.caseDetail.partyViewTab);
    if (!partyViewTab) {
      store.set(
        state.currentViewMetadata.caseDetail.partyViewTab,
        PARTY_VIEW_TABS[props.partiesTab] ||
          PARTY_VIEW_TABS.petitionersAndCounsel,
      );
    }
  }
};
