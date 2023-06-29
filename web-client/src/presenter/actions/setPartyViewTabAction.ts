import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the currentViewMetadata.partyViewTab view.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props.tab the tab to display
 */
export const setPartyViewTabAction = ({ props, store }: ActionProps) => {
  store.set(state.currentViewMetadata.caseDetail.partyViewTab, props.tab);
};
