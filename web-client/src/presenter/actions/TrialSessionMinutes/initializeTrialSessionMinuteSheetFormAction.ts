import {
  KeyedActionFilingFormFieldsByRenderKey,
  KeyedPartyFormFieldsByRenderKey,
  initialMinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  CONTACT_TYPES,
  FILDED_BY_TYPES,
  MOTION_OBJECTION_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  REPRESENTATIVE_TYPES,
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

export const initializeTrialSessionMinuteSheetFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, judgeOptions, trialSession } = props;
  const currentUser = get(state.user);
  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      currentUser,
      trialSession,
    });

  const judge = judgeOptions[formattedTrialSession.judge?.userId!];

  store.set(state.minuteSheetForm, cloneDeep(initialMinuteSheetFormState));

  store.set(state.minuteSheetForm.trialSessionMetadataSection, {
    courtReporter: formattedTrialSession.courtReporter,
    judge: {
      fullName: judge.fullName,
      title: judge.title,
      userId: judge.userId,
    },
    remoteSession: formattedTrialSession.isRemoteSession,
    trialClerk: formattedTrialSession.formattedTrialClerk,
  });

  const recalledRowRenderKey = uuidv4();
  const motionRowRenderKey = uuidv4();
  const petitionerWitnessRowRenderKey = uuidv4();
  const respondentWitnessRowRenderKey = uuidv4();
  const exhibitRowRenderKey = uuidv4();

  store.set(state.minuteSheetForm.caseMetadataSection.recalled, {
    [recalledRowRenderKey]: {
      date: '',
      note: '',
      renderKey: recalledRowRenderKey,
      transcriptOrdered: false,
    },
  });
  store.set(
    state.minuteSheetForm.petitionersSection.petitioners,
    getPetitionersFromCase(caseDetail),
  );
  store.set(
    state.minuteSheetForm.respondentsSection.respondents,
    getRespondentsFromCase(caseDetail),
  );
  store.set(state.minuteSheetForm.motionsSection.motions, {
    [motionRowRenderKey]: {
      date: '',
      filedBy: '',
      note: '',
      objection: '',
      oralMotion: false,
      renderKey: motionRowRenderKey,
      status: '',
      type: '',
    },
  });
  store.set(
    state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings,
    getPendingItemsFromCase({
      caseDetail,
      user: currentUser,
    }),
  );
  store.set(state.minuteSheetForm.witnessesSection.petitionerWitnesses, {
    [petitionerWitnessRowRenderKey]: {
      name: '',
      renderKey: petitionerWitnessRowRenderKey,
    },
  });
  store.set(state.minuteSheetForm.witnessesSection.respondentWitnesses, {
    [respondentWitnessRowRenderKey]: {
      name: '',
      renderKey: respondentWitnessRowRenderKey,
    },
  });
  store.set(state.minuteSheetForm.exhibitsSection.exhibits, {
    [exhibitRowRenderKey]: {
      description: '',
      note: '',
      renderKey: exhibitRowRenderKey,
      status: '',
    },
  });

  store.set(state.minuteSheetForm.options.judgeOptions, judgeOptions);
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
      let role;
      if (petitioner.contactType === CONTACT_TYPES.petitioner) {
        role = petitionersWithCounselUserIds.includes(petitioner.contactId)
          ? REPRESENTATIVE_TYPES.counsel
          : REPRESENTATIVE_TYPES.prose;
      } else {
        role = petitioner.contactType;
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
    docketEntry => applicationContext.getUtilities().isPending(docketEntry),
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
  const reverseLookupStructure = invert(ACTION_DOCUMENT_TYPE_OPTIONS);
  const objectionReverseLookup = invert(MOTION_OBJECTION_OPTIONS);
  const objectionsToObjectionOptionMap = {
    [OBJECTIONS_OPTIONS_MAP.NO]:
      objectionReverseLookup[MOTION_OBJECTION_OPTIONS.noObjection],
    [OBJECTIONS_OPTIONS_MAP.YES]:
      objectionReverseLookup[MOTION_OBJECTION_OPTIONS.objection],
    [OBJECTIONS_OPTIONS_MAP.UNKNOWN]:
      objectionReverseLookup[MOTION_OBJECTION_OPTIONS.unknown],
  };

  const directMatch = reverseLookupStructure[pendingItem.documentType];
  if (directMatch) {
    return { description: '', documentType: directMatch, objection: '' };
  }

  let transformedDocumentType;
  let objection = '';
  if (DocketEntry.isNotice(pendingItem.eventCode)) {
    transformedDocumentType = 'notice';
  } else if (DocketEntry.isOrder(pendingItem.eventCode)) {
    transformedDocumentType = 'order';
  } else if (DocketEntry.isMotion(pendingItem.eventCode)) {
    transformedDocumentType = 'motion';
    objection = objectionsToObjectionOptionMap[pendingItem.objections]
      ? objectionsToObjectionOptionMap[pendingItem.objections]
      : objectionReverseLookup[MOTION_OBJECTION_OPTIONS.unknown];
  } else {
    transformedDocumentType = 'other';
  }

  const description = pendingItem.documentType;

  return {
    description,
    documentType: transformedDocumentType,
    objection,
  };
};

export const transformFiledBy = (caseDetail: RawCase, pendingItem): string => {
  const isPetitioner = pendingItem.filers.some(id =>
    caseDetail.petitioners.some(petitioner => id === petitioner.contactId),
  );
  const isRespondent = pendingItem.filers.some(id =>
    caseDetail.irsPractitioners?.some(
      practitioner => id === practitioner.userId,
    ),
  );

  if (isPetitioner && isRespondent) {
    return FILDED_BY_TYPES.petitionerAndRespondent;
  } else if (isPetitioner) {
    return FILDED_BY_TYPES.petitioner;
  } else if (isRespondent) {
    return FILDED_BY_TYPES.respondent;
  }

  return FILDED_BY_TYPES.other;
};
