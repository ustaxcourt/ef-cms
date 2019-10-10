const constants = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

/**
 * sets the service indicators for parties on the given case
 *
 * @param {object} caseDetail case to set service indicators on
 * @returns {object} service indicators for petitioner, practitioners, and respondents
 */
const setServiceIndicatorsForCase = caseDetail => {
  const {
    contactPrimary,
    contactSecondary,
    isPaper,
    practitioners,
    respondents,
  } = caseDetail;

  let hasPrimaryPractitioner = false;
  let hasSecondaryPractitioner = false;

  // respondents
  if (respondents && respondents.length) {
    respondents.forEach(
      respondent => (respondent.serviceIndicator = constants.SI_ELECTRONIC),
    );
  }

  // practitioners
  if (practitioners && practitioners.length) {
    practitioners.forEach(practitioner => {
      hasPrimaryPractitioner = !!practitioner.representingPrimary;
      hasSecondaryPractitioner = !!practitioner.representingSecondary;

      practitioner.serviceIndicator = practitioner.userId
        ? constants.SI_ELECTRONIC
        : constants.SI_PAPER;
    });
  }

  // contactPrimary
  if (contactPrimary) {
    if (hasPrimaryPractitioner) {
      contactPrimary.serviceIndicator = constants.SI_NONE;
    } else {
      contactPrimary.serviceIndicator = isPaper
        ? constants.SI_PAPER
        : constants.SI_ELECTRONIC;
    }
  }

  // contactSecondary
  if (contactSecondary) {
    contactSecondary.serviceIndicator = hasSecondaryPractitioner
      ? constants.SI_NONE
      : constants.SI_PAPER;
  }

  return caseDetail;
};

module.exports = {
  constants,
  setServiceIndicatorsForCase,
};
