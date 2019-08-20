export const constants = {
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
export const setServiceIndicatorsForCase = caseDetail => {
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
      if (practitioner.representingPrimary) {
        hasPrimaryPractitioner = true;
      }

      if (practitioner.representingSecondary) {
        hasSecondaryPractitioner = true;
      }

      if (practitioner.userId) {
        practitioner.serviceIndicator = constants.SI_ELECTRONIC;
      } else {
        practitioner.serviceIndicator = constants.SI_PAPER;
      }
    });
  }

  // contactPrimary
  if (hasPrimaryPractitioner) {
    contactPrimary.serviceIndicator = constants.SI_NONE;
  } else {
    if (isPaper) {
      contactPrimary.serviceIndicator = constants.SI_PAPER;
    } else {
      contactPrimary.serviceIndicator = constants.SI_ELECTRONIC;
    }
  }

  // contactSecondary
  if (contactSecondary) {
    if (hasSecondaryPractitioner) {
      contactSecondary.serviceIndicator = constants.SI_NONE;
    } else {
      contactSecondary.serviceIndicator = constants.SI_PAPER;
    }
  }

  return caseDetail;
};
