import {
  BRIEF_SUBTYPE,
  PETITIONER_ROLE_OPTIONS,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  MOTION_TYPE_OPTIONS,
  MOTION_FILED_BY_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_OBJECTION_OPTIONS,
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  TRIAL_HEARING_OPTIONS,
  EXHIBIT_STATUS_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import {
  BriefDetailsType,
  MinuteSheet,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { encode } from 'he';
import { invert } from 'lodash';

export type FormattedMinuteSheet = {
  courtReporter: string;
  docketNumbers: string[];
  docketNumberWithSuffix?: string;
  judgeFullName: string;
  judgeTitle: string;
  remoteSession: string;
  trialClerk: string;
  trialLocation: string;
  trialStartDate: string;
  formattedDocketNumbers: string;
  petitioners: string;
  petitionerAppearances: string[];
  called: string;
  notCalled: string;
  recalled: { content: string }[];
  pretrialConference?: string;
  trialHearing?: string;
  respondentAppearances: string[];
  jurisdictionRetained?: string;
  jurisdictionContinued?: string;
  statusReportOrdered: string;
  stipulatedDecisionOrdered: string;
  motions: {
    motionType: string;
    content: string;
  }[];
  actionsAndFilings: {
    content: string;
  }[];
  trialBrief: {
    dateSubmitted: string;
    benchOpinionRendered: string;
    totalTrialHours: string;
    briefType: string;
    briefDetails: string[];
  };
  petitionerWitnesses: { name: string }[];
  respondentWitnesses: { name: string }[];
  exhibits: {
    description: string;
    status: string;
    note: string;
  }[];
};

type FormattedRow = {
  content: string;
};

export const formatMinuteSheet = ({
  aCase,
  minuteSheet,
  trialSession,
}: {
  minuteSheet: MinuteSheet;
  trialSession: RawTrialSession;
  aCase: RawCase;
}): FormattedMinuteSheet => {
  const { docketNumberWithSuffix } = aCase;
  const docketNumbers = aCase.consolidatedCases.map(
    consolidatedCase => consolidatedCase.docketNumber,
  );
  const { calendarCall, notCalled, pretrialConference, recalls, trialHearing } =
    minuteSheet.caseRecord;

  return {
    actionsAndFilings: formatActionsAndFilings(
      sanitizeMinuteSheetForm(minuteSheet.proceedings.actionsAndFilings),
    ),
    called: formatCalledSection(sanitizeMinuteSheetForm(calendarCall)),
    courtReporter: minuteSheet.trialSession.courtReporter,
    docketNumberWithSuffix,
    docketNumbers,
    exhibits: formatExhibits(minuteSheet.evidence.exhibits),
    formattedDocketNumbers: getConsolidatedDocketNumbers(aCase),
    judgeFullName: minuteSheet.trialSession.judge.fullName,
    judgeTitle: minuteSheet.trialSession.judge.title || 'Judge',
    jurisdictionContinued: formatJurisdictionContinued(
      sanitizeMinuteSheetForm(minuteSheet.jurisdiction.continued),
    ),
    jurisdictionRetained: formatJurisdictionRetained(
      sanitizeMinuteSheetForm(minuteSheet.jurisdiction.retained),
    ),
    motions: formatMotions(
      sanitizeMinuteSheetForm(minuteSheet.proceedings.motions),
    ),
    notCalled: formatCalledSection(sanitizeMinuteSheetForm(notCalled)),
    petitionerAppearances: formatPetitionerAppearances(
      sanitizeMinuteSheetForm(minuteSheet.appearances.petitioners),
    ),
    petitionerWitnesses: formatWitnesses(
      minuteSheet.evidence.petitionerWitnesses,
    ),
    petitioners: formatPetitioners(aCase),
    pretrialConference: formatPretrialConference(
      sanitizeMinuteSheetForm(pretrialConference),
    ),
    recalled: formatRecalledRows(sanitizeMinuteSheetForm(recalls)),
    remoteSession: formatRemoteSession(minuteSheet.trialSession.isRemote),
    respondentAppearances: formatRespondentAppearances(
      minuteSheet.appearances.respondents,
    ),
    respondentWitnesses: formatWitnesses(
      minuteSheet.evidence.respondentWitnesses,
    ),
    statusReportOrdered: formatStatusReportOrdered(
      sanitizeMinuteSheetForm(minuteSheet.orders.statusReport),
    ),
    stipulatedDecisionOrdered: formatStipulatedDecision(
      sanitizeMinuteSheetForm(minuteSheet.orders.stipulatedDecision),
    ),
    trialBrief: formatTrialBrief(sanitizeMinuteSheetForm(minuteSheet.brief)),
    trialClerk: minuteSheet.trialSession.trialClerk,
    trialHearing: formatTrialHearing(sanitizeMinuteSheetForm(trialHearing)),
    trialLocation: trialSession.trialLocation!,
    trialStartDate: formatDateString(
      trialSession.startDate,
      FORMATS.MONTH_DAY_YEAR,
    ),
  };
};

export const sanitizeMinuteSheetForm = (minuteSheetForm: any): any => {
  if (typeof minuteSheetForm === 'string') {
    return encode(minuteSheetForm, {
      useNamedReferences: true,
    });
  }

  if (Array.isArray(minuteSheetForm)) {
    return minuteSheetForm.map(item => sanitizeMinuteSheetForm(item));
  }

  if (minuteSheetForm && typeof minuteSheetForm === 'object') {
    return Object.entries(minuteSheetForm).reduce((acc, [key, value]) => {
      acc[key] = sanitizeMinuteSheetForm(value);
      return acc;
    }, {});
  }

  return minuteSheetForm;
};

export const getBriefDetails = (briefDetails: BriefDetailsType) => {
  const sortOrder = {
    answering: 2,
    memoranda: 1,
    opening: 0,
    reply: 3,
    surReply: 4,
  };

  const briefSubtypes = Object.keys(briefDetails);
  const result = briefSubtypes
    .sort((a, b) => sortOrder[a] - sortOrder[b])
    .map(briefSubtype => {
      const briefDetail = briefDetails[briefSubtype];
      let stringSubtype = [
        briefDetail.partyType ? briefDetail.partyType : '',
        briefDetail.dueDate
          ? `Due ${formatDateString(briefDetail.dueDate, FORMATS.MMDDYYYY)}`
          : '',
        briefDetail.note ? `<em>${briefDetail.note}</em>` : '',
      ]
        .filter(stringBriefSubtype => !!stringBriefSubtype)
        .join('; ');

      stringSubtype = stringSubtype
        ? `${BRIEF_SUBTYPE[briefSubtype]} - ${stringSubtype}`
        : '';
      return stringSubtype;
    })
    .filter(stringSubtype => !!stringSubtype);

  return result;
};

export const getConsolidatedDocketNumbers = (aCase: RawCase): string => {
  if (aCase.consolidatedCases.length === 0) {
    return aCase.docketNumber;
  }
  return aCase.consolidatedCases
    .map(consolidatedCase => consolidatedCase.docketNumber)
    .join(', ');
};

export const formatWitnesses = (
  witnessesSection:
    | MinuteSheet['evidence']['petitionerWitnesses']
    | MinuteSheet['evidence']['respondentWitnesses'],
) => {
  return Object.values(witnessesSection).filter(witness => !!witness.name);
};

export const formatPetitioners = (aCase: RawCase) =>
  aCase.petitioners.map(petitioner => petitioner.name).join(', ');

export const formatRemoteSession = (isRemoteSession: boolean) =>
  isRemoteSession ? 'Yes' : 'No';

export const formatCalledSection = (
  calendarCall: MinuteSheet['caseRecord']['calendarCall'],
): string => {
  if (!calendarCall) return '';
  return [
    formatDateString(calendarCall.date, FORMATS.MMDDYYYY),
    calendarCall.note && `<em>${calendarCall.note}</em>`,
    calendarCall.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(substring => !!substring)
    .join('; ');
};

export const formatPetitionerAppearances = (
  petitioners: MinuteSheet['appearances']['petitioners'],
): string[] => {
  return petitioners.noAppearance
    ? ['No appearance']
    : petitioners.appearances
        .map(petitioner => {
          let formattedPetitionerRole;
          if (
            petitioner.role &&
            petitioner.role ===
              invert(PETITIONER_ROLE_OPTIONS)[PETITIONER_ROLE_OPTIONS.other]
          ) {
            formattedPetitionerRole = `(${PETITIONER_ROLE_OPTIONS[petitioner.role]} - <em>${petitioner.roleNote}</em>)`;
          } else if (petitioner.role) {
            formattedPetitionerRole = `(${PETITIONER_ROLE_OPTIONS[petitioner.role]})`;
          }

          const parts = [
            petitioner.name,
            formattedPetitionerRole,
            petitioner.datesOfAppearance && `- ${petitioner.datesOfAppearance}`,
          ].filter(substring => !!substring);

          return parts.length > 0 ? parts.join(' ') : undefined;
        })
        .filter((appearance): appearance is string => !!appearance);
};

export const formatRespondentAppearances = (
  respondents: MinuteSheet['appearances']['respondents'],
): string[] => {
  return respondents
    .map(respondent => {
      const parts = [
        respondent.name,
        respondent.datesOfAppearance && `- ${respondent.datesOfAppearance}`,
      ].filter(substring => !!substring);

      return parts.length > 0 ? parts.join(' ') : undefined;
    })
    .filter((appearance): appearance is string => !!appearance);
};

export const formatJurisdictionRetained = (
  retained: MinuteSheet['jurisdiction']['retained'],
): string => {
  if (!retained?.date) return '';
  return [
    `${formatDateString(retained.date, FORMATS.MMDDYYYY)}`,
    retained.note ? `<em>${retained.note}</em>` : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatJurisdictionContinued = (
  continued: MinuteSheet['jurisdiction']['continued'],
): string => {
  if (!continued?.date) return '';
  return [
    `${formatDateString(continued.date, FORMATS.MMDDYYYY)}`,
    continued.note ? `<em>${continued.note}</em>` : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatStatusReportOrdered = (
  statusReport: MinuteSheet['orders']['statusReport'],
): string => {
  if (!statusReport) return '';
  const orderedFor =
    STATUS_REPORT_ORDERED_FOR_OPTIONS[statusReport.orderedFor] || '';
  return [
    formatDateString(statusReport.date, FORMATS.MMDDYYYY),
    orderedFor && `Ordered for ${orderedFor}`,
    statusReport.dueDate &&
      `Due ${formatDateString(statusReport.dueDate, FORMATS.MMDDYYYY)}`,
    statusReport.note && `<em>${statusReport.note}</em>`,
  ]
    .filter(substring => !!substring)
    .join('; ');
};

export const formatStipulatedDecision = (
  stipulatedDecision: MinuteSheet['orders']['stipulatedDecision'],
): string => {
  if (!stipulatedDecision) return '';
  return [
    formatDateString(stipulatedDecision.date, FORMATS.MMDDYYYY),
    stipulatedDecision.dueDate &&
      `Due ${formatDateString(stipulatedDecision.dueDate, FORMATS.MMDDYYYY)}`,
    stipulatedDecision.note && `<em>${stipulatedDecision.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatMotions = (
  motions: MinuteSheet['proceedings']['motions'],
) => {
  return motions
    .map(motion => ({
      content: [
        `${motion.oralMotion ? 'Oral ' : ''}${MOTION_TYPE_OPTIONS[motion.type] || ''}`,
        formatDateString(motion.date, FORMATS.MMDDYYYY),
        MOTION_FILED_BY_OPTIONS[motion.filedBy]
          ? `Filed by ${MOTION_FILED_BY_OPTIONS[motion.filedBy]}`
          : '',
        MOTION_STATUS_OPTIONS[motion.status],
        MOTION_OBJECTION_OPTIONS[motion.objection],
        motion.note ? `<em>${motion.note}</em>` : '',
      ]
        .filter(substring => !!substring)
        .join('; '),
      motionType: MOTION_TYPE_OPTIONS[motion.type],
    }))
    .filter(
      formattedMotion =>
        !!formattedMotion.content && !!formattedMotion.motionType,
    );
};

export const formatActionsAndFilings = (
  actionsAndFilings: MinuteSheet['proceedings']['actionsAndFilings'],
) => {
  return actionsAndFilings
    .map(action => ({
      content: [
        formatDateString(action.date, FORMATS.MMDDYYYY),
        [
          ACTION_DOCUMENT_TYPE_OPTIONS[action.documentType]
            ? `${ACTION_DOCUMENT_TYPE_OPTIONS[action.documentType]}`
            : '',
          [
            action.oralMotion ? 'Oral Motion ' : '',
            action.note ? `<em>${action.note}</em>` : '',
          ].join(''),
        ]
          .filter(substring => !!substring)
          .join(' - '),
        action.filedBy ? ACTION_FILED_BY_OPTIONS[action.filedBy] : '',
        action.status ? ACTION_STATUS_OPTIONS[action.status] : '',
        action.objection ? MOTION_OBJECTION_OPTIONS[action.objection] : '',
      ]
        .filter(substring => !!substring)
        .join('; '),
    }))
    .filter(action => !!action.content);
};

export const formatTrialBrief = (trialBrief: MinuteSheet['brief']) => {
  return {
    benchOpinionRendered: [
      trialBrief.benchOpinionDate
        ? formatDateString(trialBrief.benchOpinionDate, FORMATS.MMDDYYYY)
        : '',
      trialBrief.transcriptOrdered ? 'Transcript ordered' : '',
      trialBrief.note ? `<em>${trialBrief.note}</em>` : '',
    ]
      .filter(substring => !!substring)
      .join('; '),
    briefDetails: getBriefDetails(trialBrief.details),
    briefType: trialBrief.type || '',
    dateSubmitted: trialBrief.dateSubmitted
      ? formatDateString(trialBrief.dateSubmitted, FORMATS.MMDDYYYY)
      : '',
    totalTrialHours: trialBrief.hoursOfTrial
      ? `${trialBrief.hoursOfTrial}`
      : '',
  };
};

export const formatPretrialConference = (
  pretrialConference: MinuteSheet['caseRecord']['pretrialConference'],
): string => {
  if (!pretrialConference) return '';
  return [
    pretrialConference.date,
    pretrialConference.note && `<em>${pretrialConference.note}</em>`,
    pretrialConference.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatTrialHearing = (
  trialHearing: MinuteSheet['caseRecord']['trialHearing'],
): string => {
  if (!trialHearing) return '';
  return [
    trialHearing.date,
    trialHearing.trialHearingType &&
      TRIAL_HEARING_OPTIONS[trialHearing.trialHearingType],
    trialHearing.note && `<em>${trialHearing.note}</em>`,
    trialHearing.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatRecalledRows = (
  recalls: MinuteSheet['caseRecord']['recalls'],
): FormattedRow[] => {
  return recalls
    .map(recall => {
      const formattedRow = {
        content: [
          recall.date,
          recall.note && `<em>${recall.note}</em>`,
          recall.transcriptOrdered ? 'Transcript ordered' : '',
        ]
          .filter(Boolean)
          .join('; '),
      };

      if (formattedRow.content.length > 0) {
        return formattedRow;
      }
    })
    .filter(row => !!row);
};

export const formatExhibits = (
  exhibits: MinuteSheet['evidence']['exhibits'],
) => {
  return exhibits
    .map(exhibit => ({
      description: exhibit.description,
      note: exhibit.note || '',
      status: EXHIBIT_STATUS_OPTIONS[exhibit.status],
    }))
    .filter(
      formattedExhibit =>
        !!formattedExhibit.description ||
        !!formattedExhibit.note ||
        !!formattedExhibit.status,
    );
};
