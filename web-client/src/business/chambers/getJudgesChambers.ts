import { sortBy } from 'lodash';

const JUDGES_CHAMBERS = {
  ASHFORDS_CHAMBERS_SECTION: {
    judgeFullName: 'Tamara W. Ashford',
    label: 'Ashford’s Chambers',
    section: 'ashfordsChambers',
  },
  BUCHS_CHAMBERS_SECTION: {
    judgeFullName: 'Ronald L. Buch',
    label: 'Buch’s Chambers',
    section: 'buchsChambers',
  },
  CARLUZZOS_CHAMBERS_SECTION: {
    judgeFullName: 'Lewis R. Carluzzo',
    label: 'Carluzzo’s Chambers',
    section: 'carluzzosChambers',
  },
  COHENS_CHAMBERS_SECTION: {
    judgeFullName: 'Mary Ann Cohen',
    label: 'Cohen’s Chambers',
    section: 'cohensChambers',
  },
  COLVINS_CHAMBERS_SECTION: {
    judgeFullName: 'John O. Colvin',
    label: 'Colvin’s Chambers',
    section: 'colvinsChambers',
  },
  COPELANDS_CHAMBERS_SECTION: {
    judgeFullName: 'Elizabeth A. Copeland',
    label: 'Copeland’s Chambers',
    section: 'copelandsChambers',
  },
  FOLEYS_CHAMBERS_SECTION: {
    judgeFullName: 'Maurice B. Foley',
    label: 'Foley’s Chambers',
    section: 'foleysChambers',
  },
  FRIEDS_CHAMBERS_SECTION: {
    judgeFullName: 'Zachary S. Fried',
    label: 'Fried’s Chambers',
    section: 'friedsChambers',
  },
  GALES_CHAMBERS_SECTION: {
    judgeFullName: 'Joseph H. Gale',
    label: 'Gale’s Chambers',
    section: 'galesChambers',
  },
  GOEKES_CHAMBERS_SECTION: {
    judgeFullName: 'Joseph Robert Goeke',
    label: 'Goeke’s Chambers',
    section: 'goekesChambers',
  },
  GREAVES_CHAMBESR_SECTION: {
    judgeFullName: 'Travis A. Greaves',
    label: 'Greaves’ Chambers',
    section: 'greavesChambers',
  },
  GUSTAFSONS_CHAMBERS_SECTION: {
    judgeFullName: 'David Gustafson',
    label: 'Gustafson’s Chambers',
    section: 'gustafsonsChambers',
  },
  HALPERNS_CHAMBERS_SECTION: {
    judgeFullName: 'James S. Halpern',
    label: 'Halpern’s Chambers',
    section: 'halpernsChambers',
  },
  HOLMES_CHAMBERS_SECTION: {
    judgeFullName: 'Mark V. Holmes',
    label: 'Holmes’ Chambers',
    section: 'holmesChambers',
  },
  JONES_CHAMBERS_SECTION: {
    judgeFullName: 'Courtney D. Jones',
    label: 'Jones’ Chambers',
    section: 'jonesChambers',
  },
  KERRIGANS_CHAMBERS_SECTION: {
    judgeFullName: 'Kathleen Kerrigan',
    label: 'Kerrigan’s Chambers',
    section: 'kerrigansChambers',
  },
  LANDYS_CHAMBERS_SECTION: {
    judgeFullName: 'Adam B. Landy',
    label: 'Landy’s Chambers',
    section: 'landysChambers',
  },
  LAUBERS_CHAMBERS_SECTION: {
    judgeFullName: 'Albert G. Lauber',
    label: 'Lauber’s Chambers',
    section: 'laubersChambers',
  },
  LEYDENS_CHAMBERS_SECTION: {
    judgeFullName: 'Diana L. Leyden',
    label: 'Leyden’s Chambers',
    section: 'leydensChambers',
  },
  MARSHALLS_CHAMBERS_SECTION: {
    judgeFullName: 'Alina I. Marshall',
    label: 'Marshall’s Chambers',
    section: 'marshallsChambers',
  },
  MARVELS_CHAMBERS_SECTION: {
    judgeFullName: 'L. Paige Marvel',
    label: 'Marvel’s Chambers',
    section: 'marvelsChambers',
  },
  MORRISONS_CHAMBERS_SECTION: {
    judgeFullName: 'Richard T. Morrison',
    label: 'Morrison’s Chambers',
    section: 'morrisonsChambers',
  },
  NEGAS_CHAMBERS_SECTION: {
    judgeFullName: 'Joseph W. Nega',
    label: 'Nega’s Chambers',
    section: 'negasChambers',
  },
  PANUTHOS_CHAMBERS_SECTION: {
    judgeFullName: 'Peter J. Panuthos',
    label: 'Panuthos’ Chambers',
    section: 'panuthosChambers',
  },
  PARIS_CHAMBERS_SECTION: {
    judgeFullName: 'Elizabeth Crewson Paris',
    label: 'Paris’ Chambers',
    section: 'parisChambers',
  },
  PUGHS_CHAMBERS_SECTION: {
    judgeFullName: 'Cary Douglas Pugh',
    label: 'Pugh’s Chambers',
    section: 'pughsChambers',
  },
  RUWES_CHAMBERS_SECTION: {
    judgeFullName: 'Robert P. Ruwe',
    label: 'Ruwe’s Chambers',
    section: 'ruwesChambers',
  },
  SIEGELS_CHAMBERS_SECTION: {
    judgeFullName: 'Jennifer E. Siegel',
    label: 'Siegel’s Chambers',
    section: 'siegelsChambers',
  },
  THORNTONS_CHAMBERS_SECTION: {
    judgeFullName: 'Michael B. Thornton',
    label: 'Thornton’s Chambers',
    section: 'thorntonsChambers',
  },
  TOROS_CHAMBERS_SECTION: {
    judgeFullName: 'Emin Toro',
    label: 'Toro’s Chambers',
    section: 'torosChambers',
  },
  URDAS_CHAMBERS_SECTION: {
    judgeFullName: 'Patrick J. Urda',
    label: 'Urda’s Chambers',
    section: 'urdasChambers',
  },
  VASQUEZS_CHAMBERS_SECTION: {
    judgeFullName: 'Juan F. Vasquez',
    label: 'Vasquez’s Chambers',
    section: 'vasquezsChambers',
  },
  WEILERS_CHAMBERS_SECTION: {
    judgeFullName: 'Christian N. Weiler',
    label: 'Weiler’s Chambers',
    section: 'weilersChambers',
  },
  WELLS_CHAMBERS_SECTION: {
    judgeFullName: 'Thomas B. Wells',
    label: 'Wells’ Chambers',
    section: 'wellsChambers',
  },
};

export const getJudgesChambers = () => {
  return JUDGES_CHAMBERS;
};

export const getJudgesChambersWithLegacy = () => {
  return {
    ...JUDGES_CHAMBERS,
    LEGACY_JUDGES_CHAMBERS_SECTION: {
      label: 'Legacy Judges Chambers',
      section: 'legacyJudgesChambers',
    },
  };
};

export const getChambersSectionsLabels = () => {
  const chambersSectionsLabels = [];
  Object.keys(getJudgesChambers()).forEach(k => {
    const chambers = JUDGES_CHAMBERS[k];
    chambersSectionsLabels[chambers.section] = chambers.label;
  });
  return chambersSectionsLabels;
};

export const getChambersSections = () => {
  const chambersSections = [];
  Object.keys(getJudgesChambers()).forEach(k => {
    const chambers = JUDGES_CHAMBERS[k];
    chambersSections.push(chambers.section);
  });
  return sortBy(chambersSections);
};
