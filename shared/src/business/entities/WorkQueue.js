const { sortBy } = require('lodash');

exports.ADC_SECTION = 'ADC';
exports.ADMISSIONS_SECTION = 'Admissions';
exports.CALENDAR_SECTION = 'Calendar';
exports.CHAMBERS_SECTION = 'Chambers';
exports.CLERK_OF_THE_COURT_SECTION = 'Clerk of the Court';
exports.DOCKET_SECTION = 'Docket';
exports.PETITIONS_SECTION = 'Petitions';
exports.TRIAL_CLERKS_SECTION = 'Trial Clerks';

exports.ARMENS_CHAMBERS_SECTION = "Armen's Chambers";
exports.ASHFORDS_CHAMBERS_SECTION = "Ashford's Chambers";
exports.BUCHS_CHAMBERS_SECTION = "Buch's Chambers";
exports.CARLUZZOS_CHAMBERS_SECTION = "Carluzzo's Chambers";
exports.COHENS_CHAMBERS_SECTION = "Cohen's Chambers";
exports.COLVINS_CHAMBERS_SECTION = "Colvin's Chambers";
exports.COPELANDS_CHAMBERS_SECTION = "Copeland's Chambers";
exports.FOLEYS_CHAMBERS_SECTION = "Foley's Chambers";
exports.GALES_CHAMBERS_SECTION = "Gale's Chambers";
exports.GERBERS_CHAMBERS_SECTION = "Gerber's Chambers";
exports.GOEKES_CHAMBERS_SECTION = "Goeke's Chambers";
exports.GUSTAFSONS_CHAMBERS_SECTION = "Gustafson's Chambers";
exports.GUYS_CHAMBERS_SECTION = "Guy's Chambers";
exports.HALPERNS_CHAMBERS_SECTION = "Halpern's Chambers";
exports.HOLMES_CHAMBERS_SECTION = "Holmes' Chambers";
exports.JACOBS_CHAMBERS_SECTION = "Jacobs' Chambers";
exports.KERRIGANS_CHAMBERS_SECTION = "Kerrigan's Chambers";
exports.LAUBERS_CHAMBERS_SECTION = "Lauber's Chambers";
exports.LEYDENS_CHAMBERS_SECTION = "Leyden's Chambers";
exports.MARVELS_CHAMBERS_SECTION = "Marvel's Chambers";
exports.MORRISONS_CHAMBERS_SECTION = "Morrison's Chambers";
exports.NEGAS_CHAMBERS_SECTION = "Nega's Chambers";
exports.PANUTHOS_CHAMBERS_SECTION = "Panuthos' Chambers";
exports.PARIS_CHAMBERS_SECTION = "Paris' Chambers";
exports.PUGHS_CHAMBERS_SECTION = "Pugh's Chambers";
exports.RUWES_CHAMBERS_SECTION = "Ruwe's Chambers";
exports.THORTONS_CHAMBERS_SECTION = "Thorton's Chambers";
exports.URDAS_CHAMBES_SECTION = "Urda's Chambes";
exports.VASQUEZS_CHAMBERS_SECTION = "Vasquez's Chambers";
exports.WELLS_CHAMBERS_SECTION = "Wells' Chambers";

exports.SECTIONS = sortBy([
  exports.ADC_SECTION,
  exports.ADMISSIONS_SECTION,
  exports.CALENDAR_SECTION,
  exports.CHAMBERS_SECTION,
  exports.CLERK_OF_THE_COURT_SECTION,
  exports.DOCKET_SECTION,
  // intentially leavinvg out IRS_BATCH_SYSTEM_SECTION since that is an internal section
  exports.PETITIONS_SECTION,
  exports.TRIAL_CLERKS_SECTION,
]);

exports.CHAMBERS_SECTIONS = sortBy([
  exports.ARMENS_CHAMBERS_SECTION,
  exports.ASHFORDS_CHAMBERS_SECTION,
  exports.BUCHS_CHAMBERS_SECTION,
  exports.CARLUZZOS_CHAMBERS_SECTION,
  exports.COHENS_CHAMBERS_SECTION,
  exports.COLVINS_CHAMBERS_SECTION,
  exports.COPELANDS_CHAMBERS_SECTION,
  exports.FOLEYS_CHAMBERS_SECTION,
  exports.GALES_CHAMBERS_SECTION,
  exports.GERBERS_CHAMBERS_SECTION,
  exports.GOEKES_CHAMBERS_SECTION,
  exports.GUSTAFSONS_CHAMBERS_SECTION,
  exports.GUYS_CHAMBERS_SECTION,
  exports.HALPERNS_CHAMBERS_SECTION,
  exports.HOLMES_CHAMBERS_SECTION,
  exports.JACOBS_CHAMBERS_SECTION,
  exports.KERRIGANS_CHAMBERS_SECTION,
  exports.LAUBERS_CHAMBERS_SECTION,
  exports.LEYDENS_CHAMBERS_SECTION,
  exports.MARVELS_CHAMBERS_SECTION,
  exports.MORRISONS_CHAMBERS_SECTION,
  exports.NEGAS_CHAMBERS_SECTION,
  exports.PANUTHOS_CHAMBERS_SECTION,
  exports.PARIS_CHAMBERS_SECTION,
  exports.PUGHS_CHAMBERS_SECTION,
  exports.RUWES_CHAMBERS_SECTION,
  exports.THORTONS_CHAMBERS_SECTION,
  exports.URDAS_CHAMBES_SECTION,
  exports.VASQUEZS_CHAMBERS_SECTION,
  exports.WELLS_CHAMBERS_SECTION,
]);

/**
 *
 * @param role
 * @returns {string}
 */
exports.getSectionForRole = role => {
  if (role === 'docketclerk') {
    return exports.DOCKET_SECTION;
  } else if (role === 'seniorattorney') {
    return exports.SENIOR_ATTORNEY_SECTION;
  } else if (role === 'petitionsclerk') {
    return exports.PETITIONS_SECTION;
  } else if (role === 'irsBatchSystem') {
    return exports.IRS_BATCH_SYSTEM_SECTION;
  }
};
