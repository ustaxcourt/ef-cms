import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  BRIEF_SUBTYPE,
  BriefDetailsType,
  EXHIBIT_STATUS_OPTIONS,
  ExhibitStatusOption,
  MOTION_FILED_BY_OPTIONS,
  MOTION_OBJECTION_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_TYPE_OPTIONS,
  MinuteSheetFormState,
  PETITIONER_ROLE_OPTIONS,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  TRIAL_HEARING_OPTIONS,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';

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
    status: ExhibitStatusOption;
    note: string;
  }[];
};

type FormattedRow = {
  content: string;
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
    | MinuteSheetFormState['witnessesSection']['petitionerWitnesses']
    | MinuteSheetFormState['witnessesSection']['respondentWitnesses'],
) => {
  return Object.values(witnessesSection).filter(witness => !!witness.name);
};

export const formatPetitioners = (aCase: RawCase) => {
  return aCase.petitioners.map(petitioner => petitioner.name).join(', ');
};

export const formatRemoteSession = (isRemoteSession: boolean) => {
  return isRemoteSession ? 'Yes' : 'No';
};

export const formatCalledSection = (section: {
  date: string;
  note: string;
  transcriptOrdered?: boolean;
}): string => {
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(substring => !!substring)
    .join('; ');
};

export const formatPetitionerAppearances = (
  petitionersSection: MinuteSheetFormState['petitionersSection'],
): string[] => {
  return petitionersSection.noAppearance
    ? ['No appearance']
    : Object.values(petitionersSection.petitioners)
        .map((petitioner: any) => {
          const parts = [
            petitioner.name,
            petitioner.role && `(${PETITIONER_ROLE_OPTIONS[petitioner.role]})`,
            petitioner.datesOfAppearance && `- ${petitioner.datesOfAppearance}`,
          ].filter(substring => !!substring);

          return parts.length > 0 ? parts.join(' ') : null;
        })
        .filter((appearance): appearance is string => !!appearance);
};

export const formatRespondentAppearances = (
  respondentsSection: MinuteSheetFormState['respondentsSection'],
): string[] => {
  return Object.values(respondentsSection.respondents)
    .map((respondent: any) => {
      const parts = [
        respondent.name,
        respondent.datesOfAppearance && `- ${respondent.datesOfAppearance}`,
      ].filter(substring => !!substring);

      return parts.length > 0 ? parts.join(' ') : null;
    })
    .filter((appearance): appearance is string => !!appearance);
};

export const formatJurisdictionRetained = (
  section: MinuteSheetFormState['jurisdictionSection']['retained'],
): string | undefined => {
  if (!section?.date) return undefined;
  return [
    `${formatDateString(section.date, FORMATS.MMDDYYYY)}`,
    section.note ? `<em>${section.note}</em>` : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatJurisdictionContinued = (
  section: MinuteSheetFormState['jurisdictionSection']['continued'],
): string | undefined => {
  if (!section?.date) return undefined;
  return [
    `${formatDateString(section.date, FORMATS.MMDDYYYY)}`,
    section.note ? `<em>${section.note}</em>` : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatStatusReportOrdered = (
  section: MinuteSheetFormState['ordersSection']['statusReportOrdered'],
): string => {
  const orderedFor =
    STATUS_REPORT_ORDERED_FOR_OPTIONS[section.orderedFor] || '';
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    orderedFor && `Ordered for ${orderedFor}`,
    section.dueDate &&
      `Due ${formatDateString(section.dueDate, FORMATS.MMDDYYYY)}`,
    section.note && `<em>${section.note}</em>`,
  ]
    .filter(substring => !!substring)
    .join('; ');
};

export const formatStipulatedDecision = (
  section: MinuteSheetFormState['ordersSection']['stipulatedDecisionOrdered'],
): string => {
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    section.dueDate &&
      `Due ${formatDateString(section.dueDate, FORMATS.MMDDYYYY)}`,
    section.note && `<em>${section.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatMotions = (
  motionsSection: MinuteSheetFormState['motionsSection'],
) => {
  if (Object.entries(motionsSection.motions).length === 0) return [];
  return Object.values(motionsSection.motions)
    .map((motion: any) => ({
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
      renderKey: motion.renderKey,
    }))
    .filter(
      formattedMotion =>
        !!formattedMotion.content && !!formattedMotion.motionType, // 10419 TODO ask UX about whether or not to show a motion on the PDF if no type is selected
    );
};

export const formatActionsAndFilings = (
  section: MinuteSheetFormState['actionsAndFilingsSection'],
) => {
  return Object.values(section.actionsAndFilings)
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
      renderKey: action.renderKey,
    }))
    .filter(action => !!action.content);
};

export const formatTrialBrief = (
  trialBriefSection: MinuteSheetFormState['trialBriefSection'],
) => {
  const result = {
    benchOpinionRendered: [
      trialBriefSection.dateBenchOpinionRendered
        ? formatDateString(
            trialBriefSection.dateBenchOpinionRendered,
            FORMATS.MMDDYYYY,
          )
        : '',
      trialBriefSection.transcriptOrdered ? 'Transcript ordered' : '',
      trialBriefSection.note ? `<em>${trialBriefSection.note}</em>` : '',
    ]
      .filter(substring => !!substring)
      .join('; '),
    briefDetails: getBriefDetails(trialBriefSection.briefDetails),
    briefType: trialBriefSection.briefType || '',
    dateSubmitted: trialBriefSection.dateSubmitted
      ? formatDateString(trialBriefSection.dateSubmitted, FORMATS.MMDDYYYY)
      : '',
    totalTrialHours: trialBriefSection.totalTrialHours
      ? `${trialBriefSection.totalTrialHours}`
      : '',
  };

  return result;
};

export const formatPretrialConference = (section: any): string => {
  return [
    section.date,
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatTrialHearing = (section: any): string => {
  return [
    section.date,
    section.trialHearingType && TRIAL_HEARING_OPTIONS[section.trialHearingType],
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

export const formatRecalledRows = (
  recalledRows: MinuteSheetFormState['caseMetadataSection']['recalled'],
): FormattedRow[] => {
  return Object.values(recalledRows)
    .map(row => {
      const formattedRow = {
        content: [
          row.date,
          row.note && `<em>${row.note}</em>`,
          row.transcriptOrdered ? 'Transcript ordered' : '',
        ]
          .filter(Boolean)
          .join('; '),
        renderKey: row.renderKey,
      };

      if (formattedRow.content.length > 0) {
        return formattedRow;
      }
    })
    .filter(row => !!row);
};

export const formatExhibits = (
  exhibitsSection: MinuteSheetFormState['exhibitsSection'],
) => {
  return Object.values(exhibitsSection.exhibits)
    .map(exhibit => ({
      description: exhibit.description,
      note: exhibit.note,
      renderKey: exhibit.renderKey,
      status: EXHIBIT_STATUS_OPTIONS[exhibit.status],
    }))
    .filter(
      formattedExhibit =>
        !!formattedExhibit.description ||
        !!formattedExhibit.note ||
        !!formattedExhibit.status,
    );
};
