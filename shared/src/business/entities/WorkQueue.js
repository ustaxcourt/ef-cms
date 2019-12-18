const { sortBy } = require('lodash');

exports.ADC_SECTION = 'adc';
exports.ADMISSIONS_SECTION = 'admissions';
exports.CALENDAR_SECTION = 'calendar';
exports.CHAMBERS_SECTION = 'chambers';
exports.CLERK_OF_COURT_SECTION = 'clerkofcourt';
exports.DOCKET_SECTION = 'docket';
exports.IRS_BATCH_SYSTEM_SECTION = 'irsBatchSection';
exports.PETITIONS_SECTION = 'petitions';
exports.TRIAL_CLERKS_SECTION = 'trialClerks';

exports.ARMENS_CHAMBERS_SECTION = 'armensChambers';
exports.ASHFORDS_CHAMBERS_SECTION = 'ashfordsChambers';
exports.BUCHS_CHAMBERS_SECTION = 'buchsChambers';
exports.CARLUZZOS_CHAMBERS_SECTION = 'carluzzosChambers';
exports.COHENS_CHAMBERS_SECTION = 'cohensChambers';
exports.COLVINS_CHAMBERS_SECTION = 'colvinsChambers';
exports.COPELANDS_CHAMBERS_SECTION = 'copelandsChambers';
exports.FOLEYS_CHAMBERS_SECTION = 'foleysChambers';
exports.GALES_CHAMBERS_SECTION = 'galesChambers';
exports.GERBERS_CHAMBERS_SECTION = 'gerbersChambers';
exports.GOEKES_CHAMBERS_SECTION = 'goekesChambers';
exports.GUSTAFSONS_CHAMBERS_SECTION = 'gustafsonsChambers';
exports.GUYS_CHAMBERS_SECTION = 'guysChambers';
exports.HALPERNS_CHAMBERS_SECTION = 'halpernsChambers';
exports.HOLMES_CHAMBERS_SECTION = 'holmesChambers';
exports.JACOBS_CHAMBERS_SECTION = 'jacobsChambers';
exports.KERRIGANS_CHAMBERS_SECTION = 'kerrigansChambers';
exports.LAUBERS_CHAMBERS_SECTION = 'laubersChambers';
exports.LEYDENS_CHAMBERS_SECTION = 'leydensChambers';
exports.MARVELS_CHAMBERS_SECTION = 'marvelsChambers';
exports.MORRISONS_CHAMBERS_SECTION = 'morrisonsChambers';
exports.NEGAS_CHAMBERS_SECTION = 'negasChambers';
exports.PANUTHOS_CHAMBERS_SECTION = 'panuthosChambers';
exports.PARIS_CHAMBERS_SECTION = 'parisChambers';
exports.PUGHS_CHAMBERS_SECTION = 'pughsChambers';
exports.RUWES_CHAMBERS_SECTION = 'ruwesChambers';
exports.THORTONS_CHAMBERS_SECTION = 'thortonsChambers';
exports.URDAS_CHAMBERS_SECTION = 'urdasChambers';
exports.VASQUEZS_CHAMBERS_SECTION = 'vasquezsChambers';
exports.WELLS_CHAMBERS_SECTION = 'wellsChambers';

exports.SECTIONS = sortBy([
  exports.ADC_SECTION,
  exports.ADMISSIONS_SECTION,
  exports.CALENDAR_SECTION,
  exports.CHAMBERS_SECTION,
  exports.CLERK_OF_COURT_SECTION,
  exports.DOCKET_SECTION,
  // intentionally leaving out IRS_BATCH_SYSTEM_SECTION since that is an internal section
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
  exports.URDAS_CHAMBERS_SECTION,
  exports.VASQUEZS_CHAMBERS_SECTION,
  exports.WELLS_CHAMBERS_SECTION,
]);
