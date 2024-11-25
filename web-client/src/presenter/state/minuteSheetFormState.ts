type MotionFormFields = {
  date: string;
  type: MotionTypeOption; // motionTypeOptions
  filedBy: MotionFiledByOption;
  status: MotionStatusOption; // motionStatusOptions
  note: string;
  oralMotion: boolean;
};

type ActionFilingFormFields = {
  date: string;
  documentType: ActionDocumentTypeOption; // actionDocumentTypeOptions
  filedBy: ActionFiledByOption; // actionFiledByOptions
  status: ActionStatusOption; // actionStatusOptions
  note: string;
};

type BaseBriefFormFields = {
  dueDate: string;
  note: string;
};

type BriefFormFieldsWithPartyType = BaseBriefFormFields & {
  partyType: 'Petitioner' | 'Respondent';
};

type SeriatimBriefFormFields = {
  opening: BriefFormFieldsWithPartyType;
  answering: BriefFormFieldsWithPartyType;
  reply: BriefFormFieldsWithPartyType;
  surreply: BriefFormFieldsWithPartyType;
};

type SeriatimMemorandumBriefFormFields = SeriatimBriefFormFields;

type SimultaneousBriefFormFields = {
  opening: BaseBriefFormFields;
  answering: BaseBriefFormFields;
  reply: BaseBriefFormFields;
  surreply: BaseBriefFormFields;
};

type SimultaneousMemorandumFormFields = {
  opening: BaseBriefFormFields;
  answering: BaseBriefFormFields;
  surreply: BaseBriefFormFields;
};

type SimultaneousMemorandaOfLawFormFields = {
  memoranda: BaseBriefFormFields;
  answering: BaseBriefFormFields;
};

type SimultaneousSupplementalFormFields = {
  simultaneousSupplemental: BaseBriefFormFields;
};

type ExhibitFormFields = {
  description: string;
  status: string;
  note: string;
};

// 10419 TODO: consider whether optional fields are the best approach here, or
// if we should have explicit types for each sort of "case metadata entry".
type CaseMetadataEntry = {
  date: string;
  note: string;
  transcriptOrdered?: boolean;
  trialHearingType?: TrialHearingOption;
};

type PartyFormFields = {
  name: string;
  datesOfAppearance: string;
  // 10419 TODO: should there be a type dropdown to indicate whether the party
  // is "Counsel", "Pro se", "Intervenor", or "Participant"?
};

export type MinuteSheetFormState = {
  trialSessionMetadata: {
    judge: string;
    trialClerk: string;
    courtReporter: string;
    remoteSession: boolean;
  };

  caseMetadata: {
    called: CaseMetadataEntry;
    notCalled: CaseMetadataEntry;
    recalled: CaseMetadataEntry[];
    pretrialConference: CaseMetadataEntry;
    trialHearing: CaseMetadataEntry;
  };

  parties: {
    noAppreance: boolean;
    petitioners: PartyFormFields[];
    respondents: PartyFormFields[];
  };

  // 10419 TODO: Could this be lumped in with orders below
  jurisdictionRetained: {
    continued: boolean;
    date: string;
    note: string;
  };

  orders: {
    statusReportOrdered: {
      date: string;
      note: string;
      dueDate: string;
      orderedFor?: StatusReportOrderedForOption;
    };
    stipulatedDecisionOrdered: {
      date: string;
      note: string;
      dueDate: string;
    };
  };

  motions: MotionFormFields[];
  actionsAndFilings: ActionFilingFormFields[];

  trialBrief: {
    dateSubmitted: string;
    totalTrialHours: number;
    dateBenchOpinionRendered: string;
    transcriptOrdered: boolean;
    note: string;
    briefType: string;
    // 10419 TODO: the `briefDetails` property can have one of five distinct
    // schemas/shapes. We will need to figure out how to handle this section
    // of the form, given that there's a fair amount of overlap between these
    // five shapes.
    briefDetails:
      | SeriatimMemorandumBriefFormFields
      | SimultaneousMemorandumFormFields
      | SimultaneousMemorandaOfLawFormFields
      | SimultaneousSupplementalFormFields
      | SimultaneousBriefFormFields;
  };

  witnesses: {
    petitionerWitnesses: string[];
    respondentWitnesses: string[];
  };

  exhibits: ExhibitFormFields[];
};

export const initialMinuteSheetFormState: MinuteSheetFormState = {
  // 10419 TODO: What is a good conceptual name for this section of the form?
  trialSessionMetadata: {
    judge: '',
    trialClerk: '',
    courtReporter: '',
    remoteSession: false,
  },

  caseMetadata: {
    called: {
      date: '',
      note: '',
    },
    notCalled: {
      date: '',
      note: '',
    },
    recalled: [],
    pretrialConference: {
      date: '',
      note: '',
    },
    trialHearing: {
      date: '',
      note: '',
    },
  },

  parties: {
    noAppreance: false, // this keys to a checkbox that removes all prepopulated petitioners when checked
    petitioners: [],
    respondents: [],
  },

  jurisdictionRetained: {
    continued: false,
    date: '',
    note: '',
  },

  orders: {
    statusReportOrdered: {
      date: '',
      dueDate: '',
      orderedFor: undefined,
      note: '',
    },
    stipulatedDecisionOrdered: {
      date: '',
      dueDate: '',
      note: '',
    },
  },

  motions: [],

  actionsAndFilings: [],

  trialBrief: {
    dateSubmitted: '',
    totalTrialHours: 0,
    dateBenchOpinionRendered: '',
    transcriptOrdered: false,
    note: '',
    briefType: '',
    briefDetails: {},
  },

  witnesses: {
    petitionerWitnesses: [], // just an array of strings, each of which is a name
    respondentWitnesses: [], // just an array of strings, each of which is a name
  },

  exhibits: [],
};

const TRIAL_HEARING_OPTIONS = {
  trial: 'Trial',
  hearing: 'Hearing',
  partialTrial: 'Partial Trial',
  furtherTrial: 'Further Trial',
  furtherHearing: 'Further Hearing',
} as const;
type TrialHearingOption =
  (typeof TRIAL_HEARING_OPTIONS)[keyof typeof TRIAL_HEARING_OPTIONS];

const STATUS_REPORT_ORDERED_FOR_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  petitionerAndRespondent: 'Petitioner and Respondent',
  joint: 'Joint',
  other: 'Other',
} as const;
type StatusReportOrderedForOption =
  (typeof STATUS_REPORT_ORDERED_FOR_OPTIONS)[keyof typeof STATUS_REPORT_ORDERED_FOR_OPTIONS];

const MOTION_FILED_BY_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  joint: 'Joint',
  thirdParty: 'Third Party',
  intervenor: 'Intervenor',
} as const;
type MotionFiledByOption =
  (typeof MOTION_FILED_BY_OPTIONS)[keyof typeof MOTION_FILED_BY_OPTIONS];

const MOTION_STATUS_OPTIONS = {
  // 10419 TODO: can we derive these options from an existing constant? Same
  // question applies broadly speaking for these option constants.
  seeOrder: 'See Order',
  cav: 'CAV',
  denied: 'Denied',
  granted: 'Granted',
  filed: 'Filed',
  lodged: 'Lodged',
  objection: 'Objection',
  noObjection: 'No Objection',
} as const;
export type MotionStatusOption =
  (typeof MOTION_STATUS_OPTIONS)[keyof typeof MOTION_STATUS_OPTIONS];

const MOTION_TYPE_OPTIONS = {
  motionToDismissLackOfProsecution: 'Motion to Dismiss - Lack of Prosecution',
  motionToDismissLackOfJurisdiction: 'Motion to Dismiss - Lack of Jurisdiction',
  motionToDismissFailureToProperlyProsecute:
    'Motion to Dismiss - Failure to Properly Prosecute',
  motionToDismiss: 'Motion to Dismiss',
  motionForContinuance: 'Motion for Continuance',
  motionForGeneralContinuance: 'Motion for General Continuance',
} as const;
export type MotionTypeOption =
  (typeof MOTION_TYPE_OPTIONS)[keyof typeof MOTION_TYPE_OPTIONS];

const ACTION_DOCUMENT_TYPE_OPTIONS = {
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
  (typeof ACTION_DOCUMENT_TYPE_OPTIONS)[keyof typeof ACTION_DOCUMENT_TYPE_OPTIONS];

const ACTION_FILED_BY_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  petitionerAndRespondent: 'Petitioner and Respondent',
  joint: 'Joint',
  other: 'Other',
} as const;

export type ActionFiledByOption =
  (typeof ACTION_FILED_BY_OPTIONS)[keyof typeof ACTION_FILED_BY_OPTIONS];

const ACTION_STATUS_OPTIONS = {
  seeOrder: 'See Order',
  cav: 'CAV',
  denied: 'Denied',
  granted: 'Granted',
  filed: 'Filed',
  lodged: 'Lodged',
  objection: 'Objection',
  noObjection: 'No Objection',
} as const;

export type ActionStatusOption =
  (typeof ACTION_STATUS_OPTIONS)[keyof typeof ACTION_STATUS_OPTIONS];

const BRIEF_TYPE_OPTIONS = {
  seriatim: 'Seriatim brief',
  seriatimMemorandum: 'Seriatim memorandum brief',
  simultaneous: 'Simultaneous brief',
  simultaneousMemoranda: 'Simultaneous Memoranda of law',
  simultaneousmemorandum: 'Simultaneous memorandum brief',
  simultaneousSupplemental: 'Simultaneous Supplemental Brief',
} as const;

type BriefTypeOption =
  (typeof BRIEF_TYPE_OPTIONS)[keyof typeof BRIEF_TYPE_OPTIONS];

const EXHIBIT_STATUS_OPTIONS = {
  admitted: 'Admitted',
  notAdmitted: 'Not admitted',
  withdrawn: 'Withdrawn',
  notOffered: 'Not offered',
  reserved: 'Reserved',
  identificationOnly: 'Identification only',
  demonstrative: 'Demonstrative',
  otherSeeNote: 'Other - see note',
} as const;

export type ExhibitStatusOption =
  (typeof EXHIBIT_STATUS_OPTIONS)[keyof typeof EXHIBIT_STATUS_OPTIONS];
