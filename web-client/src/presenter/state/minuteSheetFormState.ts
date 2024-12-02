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

  petitioners: {
    noAppearance: boolean;
    petitioners: PartyFormFields[];
  };

  respondents: PartyFormFields[];

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
      | SimultaneousBriefFormFields
      | {};
  };

  witnesses: {
    petitionerWitnesses: string[];
    respondentWitnesses: string[];
  };

  exhibits: ExhibitFormFields[];
};

export const initialMinuteSheetFormState: MinuteSheetFormState = {
  actionsAndFilings: [],

  caseMetadata: {
    called: {
      date: '',
      note: '',
    },
    notCalled: {
      date: '',
      note: '',
    },
    pretrialConference: {
      date: '',
      note: '',
    },
    recalled: [{ date: '', note: '', transcriptOrdered: false }],
    trialHearing: {
      date: '',
      note: '',
    },
  },

  exhibits: [],

  jurisdictionRetained: {
    continued: false,
    date: '',
    note: '',
  },

  motions: [],

  orders: {
    statusReportOrdered: {
      date: '',
      dueDate: '',
      note: '',
      orderedFor: undefined,
    },
    stipulatedDecisionOrdered: {
      date: '',
      dueDate: '',
      note: '',
    },
  },

  petitioners: {
    noAppearance: false,
    petitioners: [
      {
        name: '',
        datesOfAppearance: '',
      },
    ],
  },

  respondents: [
    {
      name: '',
      datesOfAppearance: '',
    },
  ],

  trialBrief: {
    briefDetails: {},
    briefType: '',
    dateBenchOpinionRendered: '',
    dateSubmitted: '',
    note: '',
    totalTrialHours: 0,
    transcriptOrdered: false,
  },

  // 10419 TODO: What is a good conceptual name for this section of the form?
  trialSessionMetadata: {
    courtReporter: '',
    judge: '',
    remoteSession: false,
    trialClerk: '',
  },

  witnesses: {
    petitionerWitnesses: [], // just an array of strings, each of which is a name
    respondentWitnesses: [], // just an array of strings, each of which is a name
  },
};

export const TRIAL_HEARING_OPTIONS = {
  furtherHearing: 'Further Hearing',
  furtherTrial: 'Further Trial',
  hearing: 'Hearing',
  partialTrial: 'Partial Trial',
  trial: 'Trial',
} as const;
type TrialHearingOption =
  (typeof TRIAL_HEARING_OPTIONS)[keyof typeof TRIAL_HEARING_OPTIONS];

export const STATUS_REPORT_ORDERED_FOR_OPTIONS = {
  joint: 'Joint',
  other: 'Other',
  petitioner: 'Petitioner',
  petitionerAndRespondent: 'Petitioner and Respondent',
  respondent: 'Respondent',
} as const;
type StatusReportOrderedForOption =
  (typeof STATUS_REPORT_ORDERED_FOR_OPTIONS)[keyof typeof STATUS_REPORT_ORDERED_FOR_OPTIONS];

export const MOTION_FILED_BY_OPTIONS = {
  intervenor: 'Intervenor',
  joint: 'Joint',
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  thirdParty: 'Third Party',
} as const;
type MotionFiledByOption =
  (typeof MOTION_FILED_BY_OPTIONS)[keyof typeof MOTION_FILED_BY_OPTIONS];

export const MOTION_STATUS_OPTIONS = {
  cav: 'CAV',

  denied: 'Denied',

  filed: 'Filed',

  granted: 'Granted',

  lodged: 'Lodged',

  noObjection: 'No Objection',

  objection: 'Objection',
  // 10419 TODO: can we derive these options from an existing constant? Same
  // question applies broadly speaking for these option constants.
  seeOrder: 'See Order',
} as const;
export type MotionStatusOption =
  (typeof MOTION_STATUS_OPTIONS)[keyof typeof MOTION_STATUS_OPTIONS];

export const MOTION_TYPE_OPTIONS = {
  motionForContinuance: 'Motion for Continuance',
  motionForGeneralContinuance: 'Motion for General Continuance',
  motionToDismiss: 'Motion to Dismiss',
  motionToDismissFailureToProperlyProsecute:
    'Motion to Dismiss - Failure to Properly Prosecute',
  motionToDismissLackOfJurisdiction: 'Motion to Dismiss - Lack of Jurisdiction',
  motionToDismissLackOfProsecution: 'Motion to Dismiss - Lack of Prosecution',
} as const;
export type MotionTypeOption =
  (typeof MOTION_TYPE_OPTIONS)[keyof typeof MOTION_TYPE_OPTIONS];

export const ACTION_DOCUMENT_TYPE_OPTIONS = {
  entryOfAppearance: 'Entry of Appearance',
  filing: 'Filing',
  limitedEntryOfAppearance: 'Limited Entry of Appearance',
  motion: 'Motion',
  notice: 'Notice',
  order: 'Order',
  orderToShowCause: 'Order to Show Cause',
  other: 'Other',
} as const;

export type ActionDocumentTypeOption =
  (typeof ACTION_DOCUMENT_TYPE_OPTIONS)[keyof typeof ACTION_DOCUMENT_TYPE_OPTIONS];

export const ACTION_FILED_BY_OPTIONS = {
  joint: 'Joint',
  other: 'Other',
  petitioner: 'Petitioner',
  petitionerAndRespondent: 'Petitioner and Respondent',
  respondent: 'Respondent',
} as const;

export type ActionFiledByOption =
  (typeof ACTION_FILED_BY_OPTIONS)[keyof typeof ACTION_FILED_BY_OPTIONS];

export const ACTION_STATUS_OPTIONS = {
  cav: 'CAV',
  denied: 'Denied',
  filed: 'Filed',
  granted: 'Granted',
  lodged: 'Lodged',
  noObjection: 'No Objection',
  objection: 'Objection',
  seeOrder: 'See Order',
} as const;

export type ActionStatusOption =
  (typeof ACTION_STATUS_OPTIONS)[keyof typeof ACTION_STATUS_OPTIONS];

export const BRIEF_TYPE_OPTIONS = {
  seriatim: 'Seriatim brief',
  seriatimMemorandum: 'Seriatim memorandum brief',
  simultaneous: 'Simultaneous brief',
  simultaneousMemoranda: 'Simultaneous Memoranda of law',
  simultaneousSupplemental: 'Simultaneous Supplemental Brief',
  simultaneousmemorandum: 'Simultaneous memorandum brief',
} as const;

export type BriefTypeOption =
  (typeof BRIEF_TYPE_OPTIONS)[keyof typeof BRIEF_TYPE_OPTIONS];

export const EXHIBIT_STATUS_OPTIONS = {
  admitted: 'Admitted',
  demonstrative: 'Demonstrative',
  identificationOnly: 'Identification only',
  notAdmitted: 'Not admitted',
  notOffered: 'Not offered',
  otherSeeNote: 'Other - see note',
  reserved: 'Reserved',
  withdrawn: 'Withdrawn',
} as const;

export type ExhibitStatusOption =
  (typeof EXHIBIT_STATUS_OPTIONS)[keyof typeof EXHIBIT_STATUS_OPTIONS];
