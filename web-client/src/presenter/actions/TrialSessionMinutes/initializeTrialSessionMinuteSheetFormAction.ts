import {
  KeyedActionFilingFormFieldsByRenderKey,
  KeyedPartyFormFieldsByRenderKey,
  MinuteSheetFormState,
  initialMinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  CONTACT_TYPES,
  ExhibitStatusOption,
  MOTION_OBJECTION_OPTIONS,
  MotionFiledByOption,
  MotionObjectionOption,
  MotionStatusOption,
  MotionTypeOption,
  OBJECTIONS_OPTIONS_MAP,
  PETITIONER_ROLE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { applicationContext } from '@web-client/applicationContext';
import { cloneDeep, invert } from 'lodash';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';
import {
  FormattedTrialSessionDetailsType,
  getFormattedTrialSessionDetails,
} from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import { Judge } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const initializeTrialSessionMinuteSheetFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, judgeOptions, trialSession } = props;
  const currentUser = get(state.user);
  const formattedTrialSession = getFormattedTrialSessionDetails({
    applicationContext,
    currentUser,
    trialSession,
  });

  const initializedMinuteSheet = initializeMinuteSheet({
    emptyMinuteSheet: initialMinuteSheetFormState,
    caseDetail,
    formattedTrialSession,
    currentUser,
    judgeOptions,
  });

  store.set(state.minuteSheetForm, initializedMinuteSheet);
};

export const initializeMinuteSheet = ({
  emptyMinuteSheet,
  caseDetail,
  formattedTrialSession,
  currentUser,
  judgeOptions,
}: {
  emptyMinuteSheet: MinuteSheetFormState;
  caseDetail: RawCase;
  formattedTrialSession: FormattedTrialSessionDetailsType;
  currentUser: GetUserResponse & { email: string };
  judgeOptions: Record<string, Judge>;
}): MinuteSheetFormState => {
  const judge = judgeOptions[formattedTrialSession.judge?.userId!];
  const recalledRowRenderKey = uuidv4();
  const motionRowRenderKey = uuidv4();
  const petitionerWitnessRowRenderKey = uuidv4();
  const respondentWitnessRowRenderKey = uuidv4();
  const exhibitRowRenderKey = uuidv4();

  const initializedMinuteSheet = cloneDeep(emptyMinuteSheet);

  // Trial session metadata
  initializedMinuteSheet.trialSessionMetadataSection = {
    courtReporter: formattedTrialSession.formattedCourtReporter,
    judge: {
      fullName: judge.fullName,
      title: judge.title,
      userId: judge.userId,
    },
    remoteSession: formattedTrialSession.isRemoteSession,
    trialClerk: formattedTrialSession.formattedTrialClerk,
  };

  // Case metadata
  initializedMinuteSheet.caseMetadataSection = {
    ...emptyMinuteSheet.caseMetadataSection,
    recalled: {
      [recalledRowRenderKey]: {
        date: '',
        note: '',
        renderKey: recalledRowRenderKey,
        transcriptOrdered: false,
      },
    },
  };

  // Petitioners
  initializedMinuteSheet.petitionersSection = {
    ...emptyMinuteSheet.petitionersSection,
    petitioners: getPetitionersFromCase(caseDetail),
  };

  // Respondents
  initializedMinuteSheet.respondentsSection = {
    ...emptyMinuteSheet.respondentsSection,
    respondents: getRespondentsFromCase(caseDetail),
  };

  // Motions
  initializedMinuteSheet.motionsSection = {
    ...emptyMinuteSheet.motionsSection,
    motions: {
      [motionRowRenderKey]: {
        date: '',
        filedBy: '' as MotionFiledByOption,
        note: '',
        objection: '' as MotionObjectionOption,
        oralMotion: false,
        renderKey: motionRowRenderKey,
        status: '' as MotionStatusOption,
        type: '' as MotionTypeOption,
      },
    },
  };

  // Actions and filings
  initializedMinuteSheet.actionsAndFilingsSection = {
    ...emptyMinuteSheet.actionsAndFilingsSection,
    actionsAndFilings: getPendingItemsFromCase({
      caseDetail,
      user: currentUser,
    }),
  };

  // Witnesses
  initializedMinuteSheet.witnessesSection = {
    ...emptyMinuteSheet.witnessesSection,
    petitionerWitnesses: {
      [petitionerWitnessRowRenderKey]: {
        name: '',
        renderKey: petitionerWitnessRowRenderKey,
      },
    },
    respondentWitnesses: {
      [respondentWitnessRowRenderKey]: {
        name: '',
        renderKey: respondentWitnessRowRenderKey,
      },
    },
  };

  // Exhibits
  initializedMinuteSheet.exhibitsSection = {
    ...emptyMinuteSheet.exhibitsSection,
    exhibits: {
      [exhibitRowRenderKey]: {
        description: '',
        note: '',
        renderKey: exhibitRowRenderKey,
        status: '' as ExhibitStatusOption,
      },
    },
  };

  // Options
  initializedMinuteSheet.options = {
    ...emptyMinuteSheet.options,
    judgeOptions,
  };

  return initializedMinuteSheet;
};

export const getRespondentsFromCase = (
  caseDetail: RawCase,
): KeyedPartyFormFieldsByRenderKey => {
  const respondents = caseDetail.irsPractitioners;

  const keyedPartyFormFieldsByRenderKey = {};

  if (respondents && respondents.length > 0) {
    respondents.forEach(obj => {
      const renderKey = uuidv4();
      keyedPartyFormFieldsByRenderKey[renderKey] = {
        datesOfAppearance: '',
        name: obj.name,
        renderKey,
      };
    });
  } else {
    const renderKey = uuidv4();
    keyedPartyFormFieldsByRenderKey[renderKey] = {
      datesOfAppearance: '',
      name: '',
      renderKey,
    };
  }

  return keyedPartyFormFieldsByRenderKey;
};

export const getPetitionersFromCase = (
  caseDetail: RawCase,
): KeyedPartyFormFieldsByRenderKey => {
  const { petitioners } = caseDetail;

  const keyedPartyFormFieldsByRenderKey = {};

  const petitionersWithCounselUserIds: string[] = [];
  caseDetail.privatePractitioners?.forEach(practitioner => {
    petitionersWithCounselUserIds.push(...practitioner.representing);
  });

  if (petitioners && petitioners.length > 0) {
    petitioners.forEach(petitioner => {
      const invertedPetitionerRoleOptions = invert(PETITIONER_ROLE_OPTIONS);
      let role;
      if (petitioner.contactType === CONTACT_TYPES.petitioner) {
        role = petitionersWithCounselUserIds.includes(petitioner.contactId)
          ? invertedPetitionerRoleOptions[PETITIONER_ROLE_OPTIONS.counsel]
          : invertedPetitionerRoleOptions[PETITIONER_ROLE_OPTIONS.proSe];
      } else if (PETITIONER_ROLE_OPTIONS[petitioner.contactType]) {
        role =
          invertedPetitionerRoleOptions[
            PETITIONER_ROLE_OPTIONS[petitioner.contactType]
          ];
      } else {
        role = invertedPetitionerRoleOptions[PETITIONER_ROLE_OPTIONS.other];
      }

      const renderKey = uuidv4();
      keyedPartyFormFieldsByRenderKey[renderKey] = {
        datesOfAppearance: '',
        name: petitioner.name,
        renderKey,
        role,
      };
    });
  } else {
    const renderKey = uuidv4();
    keyedPartyFormFieldsByRenderKey[renderKey] = {
      datesOfAppearance: '',
      name: '',
      renderKey,
      role: '',
    };
  }

  return keyedPartyFormFieldsByRenderKey;
};

export const getPendingItemsFromCase = ({
  caseDetail,
  user,
}: {
  caseDetail: RawCase;
  user;
}): KeyedActionFilingFormFieldsByRenderKey => {
  const formattedCaseDetail = formatCase(applicationContext, caseDetail, user);

  const pendingItems = formattedCaseDetail.formattedDocketEntries.filter(
    docketEntry => DocketEntry.isPending(docketEntry),
  );

  const keyedActionFilingFormFieldsByRenderKey = {};
  if (pendingItems?.length > 0) {
    pendingItems.forEach(pendingItem => {
      const transformedPendingItemDetails =
        getTransformedPendingItemDetails(pendingItem);
      const renderKey = uuidv4();
      keyedActionFilingFormFieldsByRenderKey[renderKey] = {
        date: formatDateString(pendingItem.createdAt, FORMATS.YYYYMMDD),
        documentType: transformedPendingItemDetails.documentType,
        filedBy: transformFiledBy(caseDetail, pendingItem),
        note: transformedPendingItemDetails.description,
        objection: transformedPendingItemDetails.objection,
        renderKey,
        status: '',
      };
    });
  }

  const renderKey = uuidv4();
  keyedActionFilingFormFieldsByRenderKey[renderKey] = {
    date: '',
    documentType: '',
    filedBy: '',
    note: '',
    objection: '',
    oralMotion: false,
    renderKey,
    status: '',
  };

  return keyedActionFilingFormFieldsByRenderKey;
};

export const getTransformedPendingItemDetails = (
  pendingItem,
): { documentType: string; description: string; objection: string } => {
  const documentTypeReverseLookup = invert(ACTION_DOCUMENT_TYPE_OPTIONS);

  const directMatch = documentTypeReverseLookup[pendingItem.documentType];
  if (directMatch)
    return { description: '', documentType: directMatch, objection: '' };

  const getTransformedDocumentType = (
    pendingItem: {
      documuntType: string;
      eventCode: string;
      objections: string;
    } & Record<string, unknown>,
  ): string => {
    const documentTypeMap = new Map([
      [DocketEntry.isNotice, 'notice'],
      [DocketEntry.isOrder, 'order'],
      [DocketEntry.isMotion, 'motion'],
    ]);

    for (const [isType, typeName] of documentTypeMap) {
      if (isType(pendingItem.eventCode)) {
        return typeName;
      }
    }

    return 'other';
  };

  const getMatchingObjection = (
    pendingItem: {
      documuntType: string;
      eventCode: string;
      objections: string;
    } & Record<string, unknown>,
  ): string => {
    if (!DocketEntry.isMotion(pendingItem.eventCode)) return '';

    const objectionLookup = new Map([
      [OBJECTIONS_OPTIONS_MAP.NO, MOTION_OBJECTION_OPTIONS.noObjection],
      [OBJECTIONS_OPTIONS_MAP.YES, MOTION_OBJECTION_OPTIONS.objection],
      [OBJECTIONS_OPTIONS_MAP.UNKNOWN, MOTION_OBJECTION_OPTIONS.unknown],
    ]);

    const matchingObjection =
      objectionLookup.get(pendingItem.objections) ||
      MOTION_OBJECTION_OPTIONS.unknown;

    return invert(MOTION_OBJECTION_OPTIONS)[matchingObjection];
  };

  return {
    description: pendingItem.documentType,
    documentType: getTransformedDocumentType(pendingItem),
    objection: getMatchingObjection(pendingItem),
  };
};

export const transformFiledBy = (caseDetail: RawCase, pendingItem): string => {
  const invertedFileBy = invert(ACTION_FILED_BY_OPTIONS);
  if (DocketEntry.isOrder(pendingItem.eventCode))
    return invertedFileBy[ACTION_FILED_BY_OPTIONS.court];

  const isPetitioner = pendingItem.filers.some(id =>
    caseDetail.petitioners.some(petitioner => id === petitioner.contactId),
  );
  const isRespondent = pendingItem.filers.some(id =>
    caseDetail.irsPractitioners?.some(
      practitioner => id === practitioner.userId,
    ),
  );

  if (isPetitioner && isRespondent)
    return invertedFileBy[ACTION_FILED_BY_OPTIONS.petitionerAndRespondent];
  if (isPetitioner) return invertedFileBy[ACTION_FILED_BY_OPTIONS.petitioner];
  if (isRespondent) return invertedFileBy[ACTION_FILED_BY_OPTIONS.respondent];

  return invertedFileBy[ACTION_FILED_BY_OPTIONS.other];
};
