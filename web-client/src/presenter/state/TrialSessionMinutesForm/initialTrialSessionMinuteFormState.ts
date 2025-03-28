import {
  BriefTypeOption,
  StatusReportOrderedForOption,
} from '@shared/business/entities/EntityConstants';
import {
  ActionAndFiling,
  Appearance,
  BriefDetailsType,
  CalendarEvent,
  Exhibit,
  Judge,
  Motion,
  Witness,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

type RenderKey = string;
type KeyedEntry = {
  renderKey: string;
};

type KeyedCaseMetadataEntry = KeyedEntry & CalendarEvent;
type KeyedCaseMetadataEntryByKey = Record<RenderKey, KeyedCaseMetadataEntry>;

type KeyedPartyFormFields = KeyedEntry & Appearance;
export type KeyedPartyFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedPartyFormFields
>;

type KeyedMotionFormFields = KeyedEntry & Motion;
type KeyedMotionFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedMotionFormFields
>;

export type KeyedActionFilingFormFields = KeyedEntry & ActionAndFiling;
export type KeyedActionFilingFormFieldsByRenderKey = Record<
  RenderKey,
  KeyedActionFilingFormFields
>;

type KeyedWitnessEntry = KeyedEntry & Witness;
type KeyedWitnessEntryByKey = Record<RenderKey, KeyedWitnessEntry>;

type KeyedExhibitFormFields = KeyedEntry & Exhibit;
type KeyedExhibitFormFieldsByKey = Record<RenderKey, KeyedExhibitFormFields>;

export type WitnessTypeOption = 'petitioner' | 'respondent';
export type WitnessesRecord<T extends WitnessTypeOption> =
  MinuteSheetFormState['witnessesSection'][`${T}Witnesses`];

export type MinuteSheetFormState = {
  trialSessionMetadataSection: {
    judge: Judge;
    trialClerk: string;
    courtReporter: string;
    remoteSession: boolean;
  };

  caseMetadataSection: {
    called: CalendarEvent;
    notCalled: CalendarEvent;
    recalled: KeyedCaseMetadataEntryByKey;
    pretrialConference: CalendarEvent;
    trialHearing: CalendarEvent;
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
    briefType: BriefTypeOption | '';
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
    irsPractitionerOptions: {
      label: string;
      value: string;
    }[];
    judgeOptions: Record<string, Judge>;
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
    remoteSession: false,
    trialClerk: '',
  },

  witnessesSection: {
    petitionerWitnesses: {},
    respondentWitnesses: {},
  },

  options: {
    irsPractitionerOptions: [],
    judgeOptions: {},
  },
};
