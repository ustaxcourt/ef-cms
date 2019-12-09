import { startCase } from 'lodash';
import { state } from 'cerebral';

/**
 * returns computed values for the confirm initiate service modal
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const confirmInitiateServiceModalHelper = (get, applicationContext) => {
  const constants = applicationContext.getConstants();

  const formattedCase = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...get(state.caseDetail),
    });

  const parties = {
    petitioner: [formattedCase.contactPrimary, formattedCase.contactSecondary],
    practitioner: formattedCase.practitioners,
    respondent: formattedCase.respondents,
  };

  const contactsNeedingPaperService = [];

  Object.keys(parties).forEach(key => {
    parties[key].forEach(party => {
      if (
        party &&
        party.serviceIndicator === constants.SERVICE_INDICATOR_TYPES.SI_PAPER
      ) {
        contactsNeedingPaperService.push({
          name: `${party.name}, ${startCase(key)}`,
        });
      }
    });
  });

  return {
    confirmLabel:
      contactsNeedingPaperService.length > 0
        ? 'Yes, Serve and Print'
        : 'Yes, serve',
    contactsNeedingPaperService,
    showPaperAlert: contactsNeedingPaperService.length > 0,
  };
};
