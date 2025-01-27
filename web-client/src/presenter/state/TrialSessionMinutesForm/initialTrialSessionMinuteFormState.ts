/* eslint-disable sort-keys-fix/sort-keys-fix */
// Note: the order of properties in the costants defined below
// is important to the business and should not be changed.
export const MINUTE_SHEET_FORM_SECTION_MAP = {
  actionsAndFilingsSection: 'actionsAndFilingsSection',
  caseMetadataSection: 'caseMetadataSection',
  exhibitsSection: 'exhibitsSection',
  jurisdictionSection: 'jurisdictionSection',
  motionsSection: 'motionsSection',
  ordersSection: 'ordersSection',
  petitionersSection: 'petitionersSection',
  respondentsSection: 'respondentsSection',
  trialBriefSection: 'trialBriefSection',
  trialSessionMetadataSection: 'trialSessionMetadataSection',
  witnessesSection: 'witnessesSection',
} as const;

type MotionFormFields = {
  date: string;
  type: MotionTypeOption | '';
  filedBy: MotionFiledByOption | '';
  status: MotionStatusOption | '';
  objection: MotionObjectionOption | '';
  note: string;
  oralMotion: boolean;
};

type ActionFilingFormFields = {
  date: string;
  documentType: ActionDocumentTypeOption | '';
  filedBy: ActionFiledByOption | '';
  status: ActionStatusOption | '';
  note: string;
  isOnDocketRecord: boolean;
  oralMotion?: boolean;
  objection?: string;
};

export type KeyedActionFilingFormFields = KeyedEntry & ActionFilingFormFields;
export type KeyedActionFilingFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedActionFilingFormFields
>;

type BaseBriefFormFields = {
  dueDate: string;
  note: string;
};

type BriefFormFieldsWithPartyType = BaseBriefFormFields & {
  partyType: PartyTypeOptions;
};

export type SeriatimBriefFormFields = {
  opening: BriefFormFieldsWithPartyType;
  answering: BriefFormFieldsWithPartyType;
  reply: BriefFormFieldsWithPartyType;
  surreply: BriefFormFieldsWithPartyType;
};

export type SeriatimMemorandumFormFields = SeriatimBriefFormFields;

export type SimultaneousBriefFormFields = {
  opening: BaseBriefFormFields;
  answering: BaseBriefFormFields;
  reply: BaseBriefFormFields;
  surreply: BaseBriefFormFields;
};

export type SimultaneousMemorandumFormFields = {
  opening: BaseBriefFormFields;
  answering: BaseBriefFormFields;
  surreply: BaseBriefFormFields;
};

export type SimultaneousMemorandaOfLawFormFields = {
  memoranda: BaseBriefFormFields;
  answering: BaseBriefFormFields;
};

export type SimultaneousSupplementalFormFields = {
  simultaneousSupplemental: BaseBriefFormFields;
};

export type BriefDetailsType =
  | SeriatimBriefFormFields
  | SeriatimMemorandumFormFields
  | SimultaneousMemorandumFormFields
  | SimultaneousMemorandaOfLawFormFields
  | SimultaneousSupplementalFormFields
  | SimultaneousBriefFormFields
  | {};

// 10419 TODO: consider whether optional fields are the best approach here, or
// if we should have explicit types for each sort of "case metadata entry".
type CaseMetadataEntry = {
  date: string;
  note: string;
  transcriptOrdered?: boolean;
  trialHearingType?: TrialHearingOption;
};

type KeyedEntry = {
  renderKey: string;
};

type KeyedCaseMetadataEntry = KeyedEntry & CaseMetadataEntry;
type KeyedCaseMetadataEntryByKey = Record<RenderKey, KeyedCaseMetadataEntry>;

type KeyedWitnessEntry = KeyedEntry & { name: string };
type KeyedWitnessEntryByKey = Record<RenderKey, KeyedWitnessEntry>;

export let witnessTypeOptions: 'petitioner' | 'respondent';
export type WitnessesRecord<T extends 'petitioner' | 'respondent'> =
  MinuteSheetFormState['witnessesSection'][`${T}Witnesses`];

type KeyedPartyFormFields = KeyedEntry & {
  renderKey: string;
  name: string;
  datesOfAppearance: string;
  role?: string;
};

type RenderKey = string;
export type KeyedPartyFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedPartyFormFields
>;

type KeyedMotionFormFields = KeyedEntry & MotionFormFields;
type KeyedMotionFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedMotionFormFields
>;

type KeyedExhibitFormFields = KeyedEntry & {
  description: string;
  status: string;
  note: string;
};
type KeyedExhibitFormFieldsByKey = Record<RenderKey, KeyedExhibitFormFields>;

export type JudgeOption = {
  fullName: string;
  title: string;
  userId: string;
};

export type IrsPractitionerOption = {
  label: string;
  value: string;
};

export type MinuteSheetFormState = {
  trialSessionMetadataSection: {
    judge: JudgeOption;
    judgeOptions: Record<string, JudgeOption>;
    trialClerk: string;
    courtReporter: string;
    remoteSession: boolean;
  };

  caseMetadataSection: {
    called: CaseMetadataEntry;
    notCalled: CaseMetadataEntry;
    recalled: KeyedCaseMetadataEntryByKey;
    pretrialConference: CaseMetadataEntry;
    trialHearing: CaseMetadataEntry;
  };

  petitionersSection: {
    noAppearance: boolean;
    petitioners: KeyedPartyFormFieldsByRenderKey;
  };

  respondentsSection: {
    respondents: KeyedPartyFormFieldsByRenderKey;
  };

  jurisdictionSection: {
    continued: {
      date: string;
      note: string;
    };
    retained: {
      date: string;
      note: string;
    };
  };

  ordersSection: {
    statusReportOrdered: {
      date: string;
      note: string;
      dueDate: string;
      orderedFor: StatusReportOrderedForOption | '';
    };
    stipulatedDecisionOrdered: {
      date: string;
      note: string;
      dueDate: string;
    };
  };

  motionsSection: {
    motions: KeyedMotionFormFieldsByRenderKey;
  };

  actionsAndFilingsSection: {
    actionsAndFilings: KeyedActionFilingFormFieldsByRenderKey;
  };

  trialBriefSection: {
    dateSubmitted: string;
    totalTrialHours: number | undefined;
    dateBenchOpinionRendered: string;
    transcriptOrdered: boolean;
    note: string;
    briefType: string;
    briefDetails: BriefDetailsType;
  };

  witnessesSection: {
    petitionerWitnesses: KeyedWitnessEntryByKey;
    respondentWitnesses: KeyedWitnessEntryByKey;
  };

  exhibitsSection: {
    exhibits: KeyedExhibitFormFieldsByKey;
  };

  options: {
    irsPractitionerOptions: IrsPractitionerOption[];
  };
};

export const initialMinuteSheetFormState: MinuteSheetFormState = {
  actionsAndFilingsSection: { actionsAndFilings: {} },

  caseMetadataSection: {
    called: {
      date: '',
      note: '',
      transcriptOrdered: false,
    },
    notCalled: {
      date: '',
      note: '',
    },
    pretrialConference: {
      date: '',
      note: '',
      transcriptOrdered: false,
    },
    recalled: {},
    trialHearing: {
      date: '',
      note: '',
      transcriptOrdered: false,
    },
  },

  exhibitsSection: {
    exhibits: {},
  },

  jurisdictionSection: {
    continued: {
      date: '',
      note: '',
    },
    retained: {
      date: '',
      note: '',
    },
  },

  motionsSection: {
    motions: {},
  },

  ordersSection: {
    statusReportOrdered: {
      date: '',
      dueDate: '',
      note: '',
      orderedFor: '',
    },
    stipulatedDecisionOrdered: {
      date: '',
      dueDate: '',
      note: '',
    },
  },

  petitionersSection: {
    noAppearance: false,
    petitioners: {},
  },

  respondentsSection: {
    respondents: {},
  },

  trialBriefSection: {
    briefDetails: {},
    briefType: '',
    dateBenchOpinionRendered: '',
    dateSubmitted: '',
    note: '',
    totalTrialHours: undefined,
    transcriptOrdered: false,
  },

  trialSessionMetadataSection: {
    courtReporter: '',
    judge: { fullName: '', title: '', userId: '' },
    judgeOptions: {},
    remoteSession: false,
    trialClerk: '',
  },

  witnessesSection: {
    petitionerWitnesses: {},
    respondentWitnesses: {},
  },

  options: {
    irsPractitionerOptions: [],
  },
};

export const TRIAL_HEARING_OPTIONS = {
  trial: 'Trial',
  hearing: 'Hearing',
  partialTrial: 'Partial Trial',
  furtherTrial: 'Further Trial',
  furtherHearing: 'Further Hearing',
} as const;
type TrialHearingOption = keyof typeof TRIAL_HEARING_OPTIONS;

export const STATUS_REPORT_ORDERED_FOR_OPTIONS = {
  joint: 'Joint',
  other: 'Other',
  petitioner: 'Petitioner',
  petitionerAndRespondent: 'Petitioner and Respondent',
  respondent: 'Respondent',
} as const;
type StatusReportOrderedForOption =
  keyof typeof STATUS_REPORT_ORDERED_FOR_OPTIONS;

export const MOTION_FILED_BY_OPTIONS = {
  intervenor: 'Intervenor',
  joint: 'Joint',
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  thirdParty: 'Third Party',
} as const;
type MotionFiledByOption = keyof typeof MOTION_FILED_BY_OPTIONS;

export const MOTION_STATUS_OPTIONS = {
  seeOrder: 'See Order',
  cav: 'CAV',
  denied: 'Denied',
  granted: 'Granted',
  filed: 'Filed',
  lodged: 'Lodged',
} as const;
export type MotionStatusOption = keyof typeof MOTION_STATUS_OPTIONS;

export const MOTION_TYPE_OPTIONS = {
  motionToDismissLackOfProsecution: 'Motion to Dismiss - Lack of Prosecution',
  motionToDismissLackOfJurisdiction: 'Motion to Dismiss - Lack of Jurisdiction',
  motionToDismissFailureToProperlyProsecute:
    'Motion to Dismiss - Failure to Properly Prosecute',
  motionToDismiss: 'Motion to Dismiss',
  motionForContinuance: 'Motion for Continuance',
  motionForGeneralContinuance: 'Motion for General Continuance',
} as const;
export type MotionTypeOption = keyof typeof MOTION_TYPE_OPTIONS;

export const MOTION_OBJECTION_OPTIONS = {
  noObjection: 'No Objection',
  objection: 'Objection',
  unknown: 'Unknown',
} as const;
export type MotionObjectionOption = keyof typeof MOTION_OBJECTION_OPTIONS;

export const ACTION_DOCUMENT_TYPE_OPTIONS = {
  entryOfAppearance: 'Entry of Appearance',
  limitedEntryOfAppearance: 'Limited Entry of Appearance',
  orderToShowCause: 'Order to Show Cause',
  filing: 'Filing',
  motion: 'Motion',
  notice: 'Notice',
  order: 'Order',
  other: 'Other',
} as const;

export type ActionDocumentTypeOption =
  keyof typeof ACTION_DOCUMENT_TYPE_OPTIONS;

export const ACTION_FILED_BY_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  petitionerAndRespondent: 'Petitioner and Respondent',
  joint: 'Joint',
  other: 'Other',
  court: 'Court',
} as const;

export type ActionFiledByOption = keyof typeof ACTION_FILED_BY_OPTIONS;

export const ACTION_STATUS_OPTIONS = {
  seeOrder: 'See Order',
  cav: 'CAV',
  denied: 'Denied',
  granted: 'Granted',
  filed: 'Filed',
  lodged: 'Lodged',
} as const;

export type ActionStatusOption = keyof typeof ACTION_STATUS_OPTIONS;

export const BRIEF_TYPE_OPTIONS = {
  seriatimBrief: 'Seriatim Brief',
  seriatimMemorandum: 'Seriatim Memorandum Brief',
  simultaneous: 'Simultaneous Brief',
  simultaneousMemoranda: 'Simultaneous Memoranda of Law',
  simultaneousMemorandum: 'Simultaneous Memorandum Brief',
  simultaneousSupplemental: 'Simultaneous Supplemental Brief',
} as const;

export type BriefTypeOption = keyof typeof BRIEF_TYPE_OPTIONS;

export const EXHIBIT_STATUS_OPTIONS = {
  admitted: 'Admitted',
  notAdmitted: 'Not admitted',
  withdrawn: 'Withdrawn',
  notOffered: 'Not offered',
  reserved: 'Reserved',
  identificationOnly: 'Identification only',
  demonstrative: 'Demonstrative',
  otherSeeNote: 'Other - see note',
} as const;

export type ExhibitStatusOption = keyof typeof EXHIBIT_STATUS_OPTIONS;

export const PARTY_TYPE_OPTIONS_MAP = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
} as const;
type PartyTypeOptions = keyof typeof PARTY_TYPE_OPTIONS_MAP;

export const BRIEF_SUBTYPE = {
  answering: 'Answering',
  memoranda: 'Memoranda',
  opening: 'Opening',
  reply: 'Reply',
  simultaneousSupplemental: '',
  surReply: 'Sur-reply',
} as const;

export const PETITIONER_ROLE_OPTIONS = {
  counsel: 'Councel',
  proSe: 'Pro Se',
  intervenor: 'Intervenor',
  participant: 'Participant',
  translator: 'Translator',
  studentIntern: 'Student Intern',
  other: 'Other',
} as const;
export type PetitionerRoleOptions = keyof typeof PETITIONER_ROLE_OPTIONS;
