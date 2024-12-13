import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  KeyedActionFilingFormFieldsByRenderKey,
  KeyedPartyFormFieldsByRenderKey,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  CONTACT_TYPES,
  CONTACT_TYPE_TITLES,
} from '@shared/business/entities/EntityConstants';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { applicationContext } from '@web-client/applicationContext';
import { invert } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const initializeTrialSessionMinutesSheetFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, trialSession } = props;
  const user = get(state.user);

  console.log('caseDetail', caseDetail);
  console.log('trial session', trialSession);

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  store.set(state.minuteSheetForm.trialSessionMetadata, {
    courtReporter: formattedTrialSession.courtReporter,
    judge: formattedTrialSession.judge!.name,
    remoteSession: formattedTrialSession.isRemoteSession,
    trialClerk: formattedTrialSession.trialClerk!.name,
  });

  const recalledRowRenderKey = uuidv4();
  const motionRowRenderKey = uuidv4();
  const petitionerWitnessRowRenderKey = uuidv4();
  const respondentWitnessRowRenderKey = uuidv4();
  const exhibitRowRenderKey = uuidv4();

  store.set(state.minuteSheetForm.caseMetadata.recalled, {
    [recalledRowRenderKey]: {
      date: '',
      note: '',
      renderKey: recalledRowRenderKey,
      transcriptOrdered: false,
    },
  });
  store.set(
    state.minuteSheetForm.petitioners.petitioners,
    getPetitionersFromCase(caseDetail),
  );
  store.set(
    state.minuteSheetForm.respondents.respondents,
    getRespondentsFromCase(caseDetail),
  );
  store.set(state.minuteSheetForm.motionsSection.motions, {
    [motionRowRenderKey]: {
      date: '',
      filedBy: '',
      note: '',
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
      user,
    }),
  );
  store.set(state.minuteSheetForm.witnesses.petitionerWitnesses, {
    [petitionerWitnessRowRenderKey]: {
      name: '',
      renderKey: petitionerWitnessRowRenderKey,
    },
  });
  store.set(state.minuteSheetForm.witnesses.respondentWitnesses, {
    [respondentWitnessRowRenderKey]: {
      name: '',
      renderKey: respondentWitnessRowRenderKey,
    },
  });
  store.set(state.minuteSheetForm.exhibits.exhibits, {
    [exhibitRowRenderKey]: {
      description: '',
      note: '',
      renderKey: exhibitRowRenderKey,
      status: '',
    },
  });
};

const getRespondentsFromCase = (
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

const getPetitionersFromCase = (
  caseDetail: RawCase,
): KeyedPartyFormFieldsByRenderKey => {
  const { petitioners } = caseDetail;

  const keyedPartyFormFieldsByRenderKey = {};

  const petitionersWithCounselUserIds: string[] = [];
  caseDetail.privatePractitioners?.forEach(practitioner => {
    petitionersWithCounselUserIds.push(...practitioner.representing);
  });

  if (petitioners && petitioners.length > 0) {
    petitioners.forEach(obj => {
      let role;
      if (obj.contactType === CONTACT_TYPES.petitioner) {
        role = petitionersWithCounselUserIds.includes(obj.contactId)
          ? 'Counsel'
          : 'Pro Se';
      } else {
        role = CONTACT_TYPE_TITLES[obj.contactType];
      }

      const renderKey = uuidv4();
      keyedPartyFormFieldsByRenderKey[renderKey] = {
        datesOfAppearance: '',
        name: obj.name,
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

const getPendingItemsFromCase = ({
  caseDetail,
  user,
}: {
  caseDetail: RawCase;
  user;
}): KeyedActionFilingFormFieldsByRenderKey => {
  const formattedCaseDetail = applicationContext
    .getUtilities()
    .formatCase(applicationContext, caseDetail, user);

  const pendingItems = formattedCaseDetail.formattedDocketEntries.filter(
    docketEntry => applicationContext.getUtilities().isPending(docketEntry),
  );

  const keyedActionFilingFormFieldsByRenderKey = {};
  if (pendingItems?.length > 0) {
    pendingItems.forEach(pendingItem => {
      const renderKey = uuidv4();
      keyedActionFilingFormFieldsByRenderKey[renderKey] = {
        date: formatDateString(pendingItem.createdAt, FORMATS.MMDDYYYY),
        documentType: transformDocumentType(pendingItem.documentType),
        filedBy: transformFiledBy(caseDetail, pendingItem),
        isOnDocketRecord: true,
        note: '',
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
    isOnDocketRecord: false,
    note: '',
    renderKey,
    status: '',
  };

  return keyedActionFilingFormFieldsByRenderKey;
};

const transformDocumentType = (documentType: string) => {
  const reverseLookupStructure = invert(ACTION_DOCUMENT_TYPE_OPTIONS);

  return reverseLookupStructure[documentType] ?? 'other';
};

const transformFiledBy = (caseDetail: RawCase, pendingItem): string => {
  const isPetitioner = pendingItem.filers.some(id =>
    caseDetail.petitioners.some(petitioner => id === petitioner.contactId),
  );
  const isRespondent = pendingItem.filers.some(id =>
    caseDetail.irsPractitioners?.some(
      practitioner => id === practitioner.userId,
    ),
  );

  // 10419 TODO figure out what constitutes a "joint" filed by

  if (isPetitioner && isRespondent) {
    return 'petitionerAndRespondent';
  } else if (isPetitioner) {
    return 'petitioner';
  } else if (isRespondent) {
    return 'respondent';
  }

  return 'other';
};
