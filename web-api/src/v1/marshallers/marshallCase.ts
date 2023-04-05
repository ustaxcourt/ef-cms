const {
  getContactPrimary,
  getContactSecondary,
} = require('../../../../shared/src/business/entities/cases/Case');
const { marshallContact } = require('./marshallContact');
const { marshallDocketEntry } = require('./marshallDocketEntry');
const { marshallPractitioner } = require('./marshallPractitioner');

/**
 * The returned object is specified by the v1 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} caseObject the most up-to-date representation of a case
 * @returns {object} the v1 representation of a case
 */
exports.marshallCase = caseObject => {
  const contactPrimary = getContactPrimary(caseObject) || undefined;
  const contactSecondary = getContactSecondary(caseObject) || undefined;
  return {
    caseCaption: caseObject.caseCaption,
    caseType: caseObject.caseType,
    contactPrimary: contactPrimary
      ? marshallContact(contactPrimary)
      : undefined,
    contactSecondary: contactSecondary
      ? marshallContact(contactSecondary)
      : undefined,
    docketEntries: (caseObject.docketEntries || []).map(marshallDocketEntry),
    docketNumber: caseObject.docketNumber,
    docketNumberSuffix: caseObject.docketNumberSuffix,
    filingType: caseObject.filingType,
    leadDocketNumber: caseObject.leadDocketNumber,
    noticeOfTrialDate: caseObject.noticeOfTrialDate,
    partyType: caseObject.partyType,
    practitioners: (caseObject.privatePractitioners || []).map(
      marshallPractitioner,
    ),
    preferredTrialCity: caseObject.preferredTrialCity,
    respondents: (caseObject.irsPractitioners || []).map(marshallPractitioner),
    sortableDocketNumber: caseObject.sortableDocketNumber,
    status: caseObject.status,
    trialLocation: caseObject.trialLocation,
  };
};
