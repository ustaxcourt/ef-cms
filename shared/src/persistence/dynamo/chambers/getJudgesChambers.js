import { sortBy } from 'lodash';

const JUDGES_CHAMBERS = {
  ASHFORDS_CHAMBERS_SECTION: {
    label: 'Ashford’s Chambers',
    section: 'ashfordsChambers',
  },
  BUCHS_CHAMBERS_SECTION: {
    label: 'Buch’s Chambers',
    section: 'buchsChambers',
  },
  CARLUZZOS_CHAMBERS_SECTION: {
    label: 'Carluzzo’s Chambers',
    section: 'carluzzosChambers',
  },
  COHENS_CHAMBERS_SECTION: {
    label: 'Cohen’s Chambers',
    section: 'cohensChambers',
  },
  COLVINS_CHAMBERS_SECTION: {
    label: 'Colvin’s Chambers',
    section: 'colvinsChambers',
  },
  COPELANDS_CHAMBERS_SECTION: {
    label: 'Copeland’s Chambers',
    section: 'copelandsChambers',
  },
  FOLEYS_CHAMBERS_SECTION: {
    label: 'Foley’s Chambers',
    section: 'foleysChambers',
  },
  GALES_CHAMBERS_SECTION: {
    label: 'Gale’s Chambers',
    section: 'galesChambers',
  },
  GOEKES_CHAMBERS_SECTION: {
    label: 'Goeke’s Chambers',
    section: 'goekesChambers',
  },
  GREAVES_CHAMBESR_SECTION: {
    label: 'Greaves’ Chambers',
    section: 'greavesChambers',
  },
  GUSTAFSONS_CHAMBERS_SECTION: {
    label: 'Gustafson’s Chambers',
    section: 'gustafsonsChambers',
  },
  GUYS_CHAMBERS_SECTION: {
    label: 'Guy’s Chambers',
    section: 'guysChambers',
  },
  HALPERNS_CHAMBERS_SECTION: {
    label: 'Halpern’s Chambers',
    section: 'halpernsChambers',
  },
  HOLMES_CHAMBERS_SECTION: {
    label: 'Holmes’ Chambers',
    section: 'holmesChambers',
  },
  JONES_CHAMBERS_SECTION: {
    label: 'Jones’ Chambers',
    section: 'jonesChambers',
  },
  KERRIGANS_CHAMBERS_SECTION: {
    label: 'Kerrigan’s Chambers',
    section: 'kerrigansChambers',
  },
  LAUBERS_CHAMBERS_SECTION: {
    label: 'Lauber’s Chambers',
    section: 'laubersChambers',
  },
  LEYDENS_CHAMBERS_SECTION: {
    label: 'Leyden’s Chambers',
    section: 'leydensChambers',
  },
  MARSHALLS_CHAMBERS_SECTION: {
    label: 'Marshall’s Chambers',
    section: 'marshallsChambers',
  },
  MARVELS_CHAMBERS_SECTION: {
    label: 'Marvel’s Chambers',
    section: 'marvelsChambers',
  },
  MORRISONS_CHAMBERS_SECTION: {
    label: 'Morrison’s Chambers',
    section: 'morrisonsChambers',
  },
  NEGAS_CHAMBERS_SECTION: {
    label: 'Nega’s Chambers',
    section: 'negasChambers',
  },
  PANUTHOS_CHAMBERS_SECTION: {
    label: 'Panuthos’ Chambers',
    section: 'panuthosChambers',
  },
  PARIS_CHAMBERS_SECTION: {
    label: 'Paris’ Chambers',
    section: 'parisChambers',
  },
  PUGHS_CHAMBERS_SECTION: {
    label: 'Pugh’s Chambers',
    section: 'pughsChambers',
  },
  RUWES_CHAMBERS_SECTION: {
    label: 'Ruwe’s Chambers',
    section: 'ruwesChambers',
  },
  THORNTONS_CHAMBERS_SECTION: {
    label: 'Thornton’s Chambers',
    section: 'thorntonsChambers',
  },
  TOROS_CHAMBERS_SECTION: {
    label: 'Toro’s Chambers',
    section: 'torosChambers',
  },
  URDAS_CHAMBERS_SECTION: {
    label: 'Urda’s Chambers',
    section: 'urdasChambers',
  },
  VASQUEZS_CHAMBERS_SECTION: {
    label: 'Vasquez’s Chambers',
    section: 'vasquezsChambers',
  },
  WEILERS_CHAMBERS_SECTION: {
    label: 'Weiler’s Chambers',
    section: 'weilersChambers',
  },
  WELLS_CHAMBERS_SECTION: {
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
