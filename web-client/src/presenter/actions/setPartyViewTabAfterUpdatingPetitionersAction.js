import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

/**
 * Sets the currentViewMetadata.partyViewTab view after updating petitioners on case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 */
export const setPartyViewTabAfterUpdatingPetitionersAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { PARTY_VIEW_TABS } = applicationContext.getConstants();
  const { contactType } = props;
  const { petitioners } = props.caseDetail || get(state.caseDetail);

  let tab = PARTY_VIEW_TABS.petitionersAndCounsel;
  if (
    (contactType === CONTACT_TYPES.intervenor ||
      contactType === CONTACT_TYPES.participant) &&
    petitioners.some(
      p =>
        p.contactType === CONTACT_TYPES.intervenor ||
        p.contactType === CONTACT_TYPES.participant,
    )
  ) {
    tab = PARTY_VIEW_TABS.participantsAndCounsel;
  }
  store.set(state.currentViewMetadata.caseDetail.partyViewTab, tab);
};
