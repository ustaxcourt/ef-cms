type MotionFormFields = {
  date: string;
  type: string; // motionTypeOptions
  filedBy: MotionFiledByOption;
  status: string; // motionStatusOptions
  note: string;
  oralMotion: boolean;
};

type ActionFilingFormFields = {
  date: string;
  documentType: string; // actionDocumentTypeOptions
  filedBy: string; // actionFiledByOptions
  status: string; // actionStatusOptions
  note: string;
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

export const initialMinuteSheetFormState = {
  // 10419 TODO: What is a good conceptual name for this section of the form?
  trialSessionMetadata: {
    judge: '',
    trialClerk: '',
    courtReporter: '',
    remoteSession: false,
  },

  caseMetadata: {
    called: {
      //
    }, // as CaseMetadataEntry
    notCalled: {
      //
    }, // as CaseMetadataEntry
    recalled: [] as CaseMetadataEntry[],
    pretrialConference: {
      //
    }, // as CaseMetadataEntry
    trialHearing: {
      //
    }, // as CaseMetadataEntry
  },

  parties: {
    noAppreance: false, // this keys to a checkbox that removes all prepopulated petitioners when checked
    petitioners: [] as PartyFormFields[],
    respondents: [] as PartyFormFields[],
  },

  // 10419 TODO: Could this be lumped in with orders below
  jurisdictionRetained: {
    continued: false,
    date: '',
    note: '',
  },

  orders: {
    statusReportOrdered: {
      date: '',
      dateDue: '',
      orderedFor: '' as StatusReportOrderedForOption,
      note: '',
    },
    stipulatedDecisionOrdered: {
      date: '',
      dateDue: '',
      note: '',
    },
  },

  motions: [] as MotionFormFields[],

  actionsAndFilings: [] as ActionFilingFormFields[],

  trialBrief: {
    dateSubmitted: '',
    totalTrialHours: 0,
    dateBenchOpinionRendered: '',
    transcriptOrdered: false,
    note: '',
    briefType: '',
    // 10419 TODO: the `briefDetails` property can have one of five distinct
    // schemas/shapes. We will need to figure out how to handle this section
    // of the form, given that there's a fair amount of overlap between these
    // five shapes.
    briefDetails: {
      //
    },
  },

  witnesses: {
    petitioners: [], // just an array of strings, each of which is a name
    respondents: [], // just an array of strings, each of which is a name
  },

  exhibits: [] as ExhibitFormFields[],
};

const TRIAL_HEARING_OPTIONS = {
  trial: 'Trial',
  hearing: 'Hearing',
  partialTrial: 'Partial Trial',
  furtherTrial: 'Further Trial',
  furtherHearing: 'Further Hearing',
};
type TrialHearingOption =
  (typeof TRIAL_HEARING_OPTIONS)[keyof typeof TRIAL_HEARING_OPTIONS];

const STATUS_REPORT_ORDERED_FOR_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  petitionerAndRespondent: 'Petitioner and Respondent',
  joint: 'Joint',
  other: 'Other',
};
type StatusReportOrderedForOption =
  (typeof STATUS_REPORT_ORDERED_FOR_OPTIONS)[keyof typeof STATUS_REPORT_ORDERED_FOR_OPTIONS];

const MOTION_FILED_BY_OPTIONS = {
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  joint: 'Joint',
  thirdParty: 'Third Party',
  intervenor: 'Intervenor',
};
type MotionFiledByOption =
  (typeof MOTION_FILED_BY_OPTIONS)[keyof typeof MOTION_FILED_BY_OPTIONS];

const motionStatusOptions = [
  // 10419 TODO: can we derive these options from an existing constant? Same
  // question applies broadly speaking for these option constants.
  // See Order
  // CAV
  // Denied
  // Granted
  // Filed
  // Lodged
  // Objection
  // No Objection
];

const motionTypeOptions = [
  //   Motion to Dismiss - Lack of Prosecution
  // Motion to Dismiss - Lack of Jurisdiction
  // Motion to Dismiss - Failure to Properly Prosecute
  // Motion to Dismiss
  // Motion for Continuance
  // Motion for General Continuance
];

const actionDocumentTypeOptions = [
  //   Entry of Appearance
  // Limited Entry of Appearance
  // Order to Show Cause
  // Filing
  // Motion
  // Notice
  // Order
  // Other
];

const actionFiledByOptions = [
  //   Petitioner
  // Respondent
  // Petitioner and Respondent
  // Joint
  // Other
];

const actionStatusOptions = [
  // See Order
  // CAV
  // Denied
  // Granted
  // Filed
  // Lodged
  // Objection
  // No Objection
];

const briefTypeOptions = [
  // Seriatim brief
  // Seriatim memorandum brief
  // Simultaneous brief
  // Simultaneous Memoranda of law
  // Simultaneous memorandum brief
  // Simultaneous Supplemental Brief
];

const exhibitStatusOptions = [
  //   Admitted
  // Not admitted
  // Withdrawn
  // Not offered
  // Reserved
  // Identification only
  // Demonstrative
  // Other - see note
];
