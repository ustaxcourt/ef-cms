import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

/**
 * Sets the currentViewMetadata.partyViewTab view.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props.tab the tab to display
 */
export const setPartyViewTabAfterRemoveAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { PARTY_VIEW_TABS } = applicationContext.getConstants();
  const { contactType: deletedContactType } = props;
  const { petitioners } = get(state.caseDetail);

  let tab = PARTY_VIEW_TABS.petitionersAndCounsel;

  // need to check if there are still otherFilers on the case
  if (
    (deletedContactType === CONTACT_TYPES.intervenor ||
      deletedContactType === CONTACT_TYPES.participant) &&
    petitioners.some(
      p =>
        p.contactType === CONTACT_TYPES.intervenor ||
        p.contactType === CONTACT_TYPES.participant,
    )
    // (and there are more intervenors or participants left on the case)
  ) {
    tab = PARTY_VIEW_TABS.participantsAndCounsel;
  }

  store.set(state.currentViewMetadata.caseDetail.partyViewTab, tab);
};
