import {
  ActionDocumentTypeOption,
  ActionFiledByOption,
  ActionStatusOption,
  BriefDetailsType,
  MotionFiledByOption,
  MotionObjectionOption,
  MotionStatusOption,
  MotionTypeOption,
  StatusReportOrderedForOption,
  TrialHearingOption,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

export type MinuteSheet = {
  trialSessionId: string;
  docketNumber: string;
  judge: { fullName: string; title: string; userId: string };
  trialClerk: string;
  courtReporter: string;
  isRemoteSession: boolean;

  caseCalendarCallDate: string;
  caseCalendarCallNote: string;
  caseCalendarCallTranscriptOrdered: boolean;
  caseNotCalledDate: string;
  caseNotCalledNote: string;
  caseNotCalledTranscriptOrdered: boolean;
  caseRecalls: { date: string; note: string; transcriptOrdered: boolean }[];
  pretrialConferenceDate: string;
  pretrialConferenceNote: string;
  pretrialConferenceTranscriptOrdered: boolean;
  trialHearingDate: string;
  trialHearingNote: string;
  trialHearingTranscriptOrdered: boolean;
  trialHearingTytpe: TrialHearingOption;

  petitionerNoAppearance: boolean;
  petitionerAppearances: PetitionerAppearance[];
  respondentAppearances: RespondentAppearance[];
  jurisdictionRetainedDate: string;
  jurisdictionRetainedNote: string;
  jurisdictionContinuedDate: string;
  jurisdictionContinuedNote: string;
  statusReportOrderedDate: string;
  statusReportOrderedNote: string;
  statusReportOrderedDueDate: string;
  statusReportOrderedFor: StatusReportOrderedForOption | '';
  stipulatedDecisionOrderedDate: string;
  stipulatedDecisionOrderedNote: string;
  stipulatedDecisionOrderedDueDate: string;
  motions: Motion[];
  actionsAndFilings: ActionAndFiling[];

  trialBriefSubmittedDate: string;
  totalTrialHours: number | undefined;
  benchOpinionRenderedDate: string;
  trialBriefTranscriptOrdered: boolean;
  trialBriefNote: string;
  trialBriefType: string;
  trialBriefDetails: BriefDetailsType;

  petitionerWitnesses: { name: string }[];
  respondentWitnesses: { name: string }[];
  exhibits: Exhibit[];
};

type PetitionerAppearance = {
  name: string;
  role: string;
  datesOfAppearance: string;
  note: string;
};

type RespondentAppearance = {
  name: string;
  datesOfAppearance: string;
  note: string;
  userId: string;
};

type Motion = {
  date: string;
  type: MotionTypeOption | '';
  filedBy: MotionFiledByOption | '';
  status: MotionStatusOption | '';
  objection: MotionObjectionOption | '';
  note: string;
  oralMotion: boolean;
};
type ActionAndFiling = {
  date: string;
  documentType: ActionDocumentTypeOption | '';
  filedBy: ActionFiledByOption | '';
  status: ActionStatusOption | '';
  note: string;
  isOnDocketRecord: boolean;
  oralMotion?: boolean;
  objection?: string;
};
type Exhibit = {
  description: string;
  status: string;
  note: string;
};
