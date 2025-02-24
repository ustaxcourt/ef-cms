import {
  ActionDocumentTypeOption,
  BriefTypeOption,
  ExhibitStatusOption,
  MotionFiledByOption,
  MotionObjectionOption,
  MotionStatusOption,
  MotionTypeOption,
  PartyTypeOption,
  PetitionerRoleOption,
  StatusReportOrderedForOption,
  TrialHearingOption,
} from '../EntityConstants';

export type MinuteSheet = {
  trialSession: {
    id: string;
    judge: Judge;
    trialClerk: string;
    courtReporter: string;
    isRemote: boolean;
  };

  caseRecord: {
    docketNumber: string;
    calendarCall: CalendarEvent;
    notCalled: CalendarEvent;
    recalls: CalendarEvent[];
    pretrialConference: Event;
    trialHearing: CalendarEvent;
  };

  appearances: {
    petitioners: {
      noAppearance: boolean;
      appearances: Appearance[];
    };
    respondents: Appearance[];
  };

  jurisdiction: {
    retained: JurisdictionEvent;
    continued: JurisdictionEvent;
  };

  orders: {
    statusReport: StatusReportOrder;
    stipulatedDecision: Order;
  };

  proceedings: {
    motions: Motion[];
    actionsAndFilings: ActionAndFiling[];
  };

  brief: Brief;

  evidence: {
    petitionerWitnesses: Witness[];
    respondentWitnesses: Witness[];
    exhibits: Exhibit[];
  };
};

export type Judge = {
  fullName: string;
  title: string;
  userId: string;
};

type Event = {
  date: string;
  note?: string;
  transcriptOrdered?: boolean;
};

export type CalendarEvent = Event & {
  trialHearingType?: TrialHearingOption | '';
};

export type Appearance = {
  name: string;
  datesOfAppearance: string;
  role?: PetitionerRoleOption;
};

type JurisdictionEvent = {
  date: string;
  note?: string;
};

type Order = {
  date: string;
  dueDate: string;
  note?: string;
};

type StatusReportOrder = Order & {
  orderedFor: StatusReportOrderedForOption;
};

export type Motion = {
  date: string;
  type: MotionTypeOption;
  filedBy: MotionFiledByOption;
  status: MotionStatusOption;
  objection: MotionObjectionOption;
  note?: string;
  oralMotion: boolean;
};

export type ActionAndFiling = {
  date: string;
  documentType: ActionDocumentTypeOption | '';
  filedBy: MotionFiledByOption | '';
  status: MotionStatusOption | '';
  note?: string;
  isOnDocketRecord: boolean;
  oralMotion?: boolean;
  objection?: string;
};

type Brief = {
  type: BriefTypeOption | '';
  details: BriefDetailsType;
  dateSubmitted?: string;
  hoursOfTrial?: number;
  benchOpinionDate?: string;
  transcriptOrdered: boolean;
  note?: string;
};

type BaseBrief = {
  dueDate: string;
  note: string;
};

type BriefWithPartyType = BaseBrief & {
  partyType: PartyTypeOption;
};

export type SeriatimBrief = {
  opening: BriefWithPartyType;
  answering: BriefWithPartyType;
  reply: BriefWithPartyType;
  surreply: BriefWithPartyType;
};

export type SeriatimMemorandum = SeriatimBrief;

export type SimultaneousBrief = {
  opening: BaseBrief;
  answering: BaseBrief;
  reply: BaseBrief;
  surreply: BaseBrief;
};

export type SimultaneousMemorandum = {
  opening: BaseBrief;
  answering: BaseBrief;
  surreply: BaseBrief;
};

export type SimultaneousMemorandaOfLaw = {
  memoranda: BaseBrief;
  answering: BaseBrief;
};

export type SimultaneousSupplemental = {
  simultaneousSupplemental: BaseBrief;
};

export type BriefDetailsType =
  | SeriatimBrief
  | SeriatimMemorandum
  | SimultaneousMemorandum
  | SimultaneousMemorandaOfLaw
  | SimultaneousSupplemental
  | SimultaneousBrief
  | {};

export type Witness = {
  name: string;
};

export type Exhibit = {
  description: string;
  status: ExhibitStatusOption;
  note?: string;
};
