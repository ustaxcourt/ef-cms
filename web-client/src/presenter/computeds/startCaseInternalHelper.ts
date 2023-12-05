import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the start case internal form view options based on partyType
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} object containing the view settings
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const startCaseInternalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { PARTY_TYPES, PAYMENT_STATUS } = applicationContext.getConstants();
  const partyType = get(state.form.partyType);
  const petitionPaymentStatus = get(state.form.petitionPaymentStatus);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  let showOrderForCorporateDisclosureStatement = false;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(partyType)
  ) {
    showOrderForCorporateDisclosureStatement = true;
  }

  const shouldShowIrsNoticeDate = get(state.form.hasVerifiedIrsNotice) === true;

  return {
    partyTypes: PARTY_TYPES,
    shouldShowIrsNoticeDate,
    showOrderForCorporateDisclosureStatement,
    showOrderForFilingFee: petitionPaymentStatus === PAYMENT_STATUS.UNPAID,
    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
