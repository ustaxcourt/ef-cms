import { sortBy } from 'lodash';

// QUESTION: SHOULD THESE CHAMBERS BE STORED IN DYNAMO?
// advantage is to make these numbers configurable if it changes although it doesn't change
// often
// are these all the judges??

type JudgeInfo = {
  judgeFullName: string;
  label: string;
  phoneNumber: string;
  section: string;
};

const JUDGES_CHAMBERS: Record<string, JudgeInfo> = {
  ASHFORDS_CHAMBERS_SECTION: {
    judgeFullName: 'Tamara W. Ashford',
    label: 'Ashford’s Chambers',
    phoneNumber: '(202) 521-0822',
    section: 'ashfordsChambers',
  },
  BUCHS_CHAMBERS_SECTION: {
    judgeFullName: 'Ronald L. Buch',
    label: 'Buch’s Chambers',
    phoneNumber: '(202) 521-0810',
    section: 'buchsChambers',
  },
  CARLUZZOS_CHAMBERS_SECTION: {
    judgeFullName: 'Lewis R. Carluzzo',
    label: 'Carluzzo’s Chambers',
    phoneNumber: '(202) 521-3339',
    section: 'carluzzosChambers',
  },
  COHENS_CHAMBERS_SECTION: {
    judgeFullName: 'Mary Ann Cohen',
    label: 'Cohen’s Chambers',
    phoneNumber: '(202) 521-0655',
    section: 'cohensChambers',
  },
  COLVINS_CHAMBERS_SECTION: {
    judgeFullName: 'John O. Colvin',
    label: 'Colvin’s Chambers',
    phoneNumber: '(202) 521-0662',
    section: 'colvinsChambers',
  },
  COPELANDS_CHAMBERS_SECTION: {
    judgeFullName: 'Elizabeth A. Copeland',
    label: 'Copeland’s Chambers',
    phoneNumber: '(202) 521-0670',
    section: 'copelandsChambers',
  },
  FOLEYS_CHAMBERS_SECTION: {
    judgeFullName: 'Maurice B. Foley',
    label: 'Foley’s Chambers',
    phoneNumber: '(202) 521-0681',
    section: 'foleysChambers',
  },
  FRIEDS_CHAMBERS_SECTION: {
    judgeFullName: 'Zachary S. Fried',
    label: 'Fried’s Chambers',
    phoneNumber: '(202) 521-0867',
    section: 'friedsChambers',
  },
  GALES_CHAMBERS_SECTION: {
    judgeFullName: 'Joseph H. Gale',
    label: 'Gale’s Chambers',
    phoneNumber: '(202) 521-0688',
    section: 'galesChambers',
  },
  GOEKES_CHAMBERS_SECTION: {
    judgeFullName: 'Joseph Robert Goeke',
    label: 'Goeke’s Chambers',
    phoneNumber: '(202) 521-0690',
    section: 'goekesChambers',
  },
  GREAVES_CHAMBESR_SECTION: {
    judgeFullName: 'Travis A. Greaves',
    label: 'Greaves’ Chambers',
    phoneNumber: '(202) 521-0736',
    section: 'greavesChambers',
  },
  GUSTAFSONS_CHAMBERS_SECTION: {
    judgeFullName: 'David Gustafson',
    label: 'Gustafson’s Chambers',
    phoneNumber: '(202) 521-0850',
    section: 'gustafsonsChambers',
  },
  HALPERNS_CHAMBERS_SECTION: {
    judgeFullName: 'James S. Halpern',
    label: 'Halpern’s Chambers',
    phoneNumber: '(202) 521-0707',
    section: 'halpernsChambers',
  },
  HOLMES_CHAMBERS_SECTION: {
    judgeFullName: 'Mark V. Holmes',
    label: 'Holmes’ Chambers',
    phoneNumber: '(202) 521-0714',
    section: 'holmesChambers',
  },
  JONES_CHAMBERS_SECTION: {
    judgeFullName: 'Courtney D. Jones',
    label: 'Jones’ Chambers',
    phoneNumber: '(202) 521-0795',
    section: 'jonesChambers',
  },
  KERRIGANS_CHAMBERS_SECTION: {
    judgeFullName: 'Kathleen Kerrigan',
    label: 'Kerrigan’s Chambers',
    phoneNumber: '(202) 521-0777',
    section: 'kerrigansChambers',
  },
  LANDYS_CHAMBERS_SECTION: {
    judgeFullName: 'Adam B. Landy',
    label: 'Landy’s Chambers',
    phoneNumber: '(202) 521-0835',
    section: 'landysChambers',
  },
  LAUBERS_CHAMBERS_SECTION: {
    judgeFullName: 'Albert G. Lauber',
    label: 'Lauber’s Chambers',
    phoneNumber: '(202) 521-0785',
    section: 'laubersChambers',
  },
  LEYDENS_CHAMBERS_SECTION: {
    judgeFullName: 'Diana L. Leyden',
    label: 'Leyden’s Chambers',
    phoneNumber: '(202) 521-0823',
    section: 'leydensChambers',
  },
  MARSHALLS_CHAMBERS_SECTION: {
    judgeFullName: 'Alina I. Marshall',
    label: 'Marshall’s Chambers',
    phoneNumber: '(202) 521-0738',
    section: 'marshallsChambers',
  },
  MARVELS_CHAMBERS_SECTION: {
    judgeFullName: 'L. Paige Marvel',
    label: 'Marvel’s Chambers',
    phoneNumber: '(202) 521-0740',
    section: 'marvelsChambers',
  },
  MORRISONS_CHAMBERS_SECTION: {
    judgeFullName: 'Richard T. Morrison',
    label: 'Morrison’s Chambers',
    phoneNumber: '(202) 521-0853',
    section: 'morrisonsChambers',
  },
  NEGAS_CHAMBERS_SECTION: {
    // confirm if judge is legit
    judgeFullName: 'Joseph W. Nega',
    label: 'Nega’s Chambers',
    section: 'negasChambers',
  },
  PANUTHOS_CHAMBERS_SECTION: {
    judgeFullName: 'Peter J. Panuthos',
    label: 'Panuthos’ Chambers',
    phoneNumber: '(202) 521-4707',
    section: 'panuthosChambers',
  },
  PARIS_CHAMBERS_SECTION: {
    judgeFullName: 'Elizabeth Crewson Paris',
    label: 'Paris’ Chambers',
    phoneNumber: '(202) 521-0839',
    section: 'parisChambers',
  },
  PUGHS_CHAMBERS_SECTION: {
    judgeFullName: 'Cary Douglas Pugh',
    label: 'Pugh’s Chambers',
    phoneNumber: '(202) 521-0824',
    section: 'pughsChambers',
  },
  RUWES_CHAMBERS_SECTION: {
    // check if judge is legit
    judgeFullName: 'Robert P. Ruwe',
    label: 'Ruwe’s Chambers',
    section: 'ruwesChambers',
  },
  SIEGELS_CHAMBERS_SECTION: {
    judgeFullName: 'Jennifer E. Siegel',
    label: 'Siegel’s Chambers',
    phoneNumber: '(202) 521-0720',
    section: 'siegelsChambers',
  },
  THORNTONS_CHAMBERS_SECTION: {
    judgeFullName: 'Michael B. Thornton',
    label: 'Thornton’s Chambers',
    phoneNumber: '(202) 521-0766',
    section: 'thorntonsChambers',
  },
  TOROS_CHAMBERS_SECTION: {
    judgeFullName: 'Emin Toro',
    label: 'Toro’s Chambers',
    phoneNumber: '(202) 521-0760',
    section: 'torosChambers',
  },
  URDAS_CHAMBERS_SECTION: {
    judgeFullName: 'Patrick J. Urda',
    label: 'Urda’s Chambers',
    phoneNumber: '(202) 521-0800',
    section: 'urdasChambers',
  },
  VASQUEZS_CHAMBERS_SECTION: {
    judgeFullName: 'Juan F. Vasquez',
    label: 'Vasquez’s Chambers',
    phoneNumber: '(202) 521-0778',
    section: 'vasquezsChambers',
  },
  WEILERS_CHAMBERS_SECTION: {
    judgeFullName: 'Christian N. Weiler',
    label: 'Weiler’s Chambers',
    phoneNumber: '(202) 521-0649',
    section: 'weilersChambers',
  },
  WELLS_CHAMBERS_SECTION: {
    // confirm if real judge
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
