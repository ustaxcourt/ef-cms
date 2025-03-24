import {
  KeyedActionFilingFormFieldsByRenderKey,
  KeyedPartyFormFieldsByRenderKey,
  MinuteSheetFormState,
  initialMinuteSheetFormState,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED,
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
  CONTACT_TYPES,
  ExhibitStatusOption,
  MOTION_OBJECTION_OPTIONS,
  MOTION_OBJECTION_OPTIONS_INVERTED,
  MotionFiledByOption,
  MotionObjectionOption,
  MotionStatusOption,
  MotionTypeOption,
  OBJECTIONS_OPTIONS_MAP,
  PETITIONER_ROLE_OPTIONS,
  PETITIONER_ROLE_OPTIONS_INVERTED,
  RESPONDENT_ROLE_OPTIONS,
  RESPONDENT_ROLE_OPTIONS_INVERTED,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { applicationContext } from '@web-client/applicationContext';
import { cloneDeep } from 'lodash';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';
import {
  FormattedTrialSessionDetailsType,
  getFormattedTrialSessionDetails,
} from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import {
  Appearance,
  Judge,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { RawPractitioner } from '@shared/business/entities/Practitioner';

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
    respondents.forEach(respondent => {
      const renderKey = uuidv4();
      keyedPartyFormFieldsByRenderKey[renderKey] = {
        datesOfAppearance: '',
        name: respondent.name,
        renderKey,
        role: RESPONDENT_ROLE_OPTIONS_INVERTED[RESPONDENT_ROLE_OPTIONS.counsel],
        note: '',
      } as Appearance;
    });
  } else {
    const renderKey = uuidv4();
    keyedPartyFormFieldsByRenderKey[renderKey] = {
      datesOfAppearance: '',
      name: '',
      renderKey,
      role: '',
      note: '',
    };
  }

  return keyedPartyFormFieldsByRenderKey;
};

export const getPetitionersFromCase = (
  caseDetail: RawCase,
): KeyedPartyFormFieldsByRenderKey => {
  const keyedPartyFormFieldsByRenderKey = {};

  if (!caseDetail.petitioners || caseDetail.petitioners.length === 0) {
    const renderKey = uuidv4();
    keyedPartyFormFieldsByRenderKey[renderKey] = {
      datesOfAppearance: '',
      name: '',
      renderKey,
      role: '',
    };

    return keyedPartyFormFieldsByRenderKey;
  }

  [
    ...getNamesAndRolesOfNonPetitionerParties(
      caseDetail.petitioners,
      caseDetail.privatePractitioners,
    ),
    ...getNamesAndRolesOfProSePetitioners(
      caseDetail.petitioners,
      caseDetail.privatePractitioners,
    ),
    ...getNamesAndRolesOfPrivatePractitionerParties(
      caseDetail.privatePractitioners || [],
    ),
  ].forEach(({ name, role }) => {
    const renderKey = uuidv4();
    keyedPartyFormFieldsByRenderKey[renderKey] = {
      datesOfAppearance: '',
      name,
      renderKey,
      role,
    };
  });

  return keyedPartyFormFieldsByRenderKey;
};

const getNamesAndRolesOfNonPetitionerParties = (
  contacts,
  privatePractitioners,
): Array<{ name: string; role: string }> => {
  return contacts
    .filter(contact => {
      return (
        contact.contactType !== CONTACT_TYPES.petitioner &&
        !privatePractitioners?.some(practitioner =>
          practitioner.representing.includes(contact.contactId),
        )
      );
    })
    .map(otherContact => {
      const role = PETITIONER_ROLE_OPTIONS[otherContact.contactType]
        ? PETITIONER_ROLE_OPTIONS_INVERTED[
            PETITIONER_ROLE_OPTIONS[otherContact.contactType]
          ]
        : PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.other];

      return {
        name: otherContact.name,
        role,
      };
    });
};

const getNamesAndRolesOfProSePetitioners = (
  contacts,
  privatePractitioners,
): Array<{ name: string; role: string }> => {
  return contacts
    .filter(contact => {
      return (
        contact.contactType === CONTACT_TYPES.petitioner &&
        !privatePractitioners?.some(practitioner =>
          practitioner.representing.includes(contact.contactId),
        )
      );
    })
    .map(petitioner => ({
      name: petitioner.name,
      role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.proSe],
    }));
};

const getNamesAndRolesOfPrivatePractitionerParties = (
  privatePractitioners: RawPractitioner[],
): Array<{
  name: string;
  role: string;
}> => {
  return privatePractitioners
    .filter(privatePractitioner => !!privatePractitioner)
    .map(privatePractitioner => ({
      name: privatePractitioner.name,
      role: PETITIONER_ROLE_OPTIONS_INVERTED[PETITIONER_ROLE_OPTIONS.counsel],
    }));
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
        filedBy: transformFiledBy(pendingItem),
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
  const directMatch =
    ACTION_DOCUMENT_TYPE_OPTIONS_INVERTED[pendingItem.documentType];
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

    return MOTION_OBJECTION_OPTIONS_INVERTED[matchingObjection];
  };

  return {
    description: pendingItem.documentType,
    documentType: getTransformedDocumentType(pendingItem),
    objection: getMatchingObjection(pendingItem),
  };
};

export const transformFiledBy = (pendingItem: RawDocketEntry): string => {
  if (DocketEntry.isOrder(pendingItem.eventCode))
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court];

  const { filedBy, privatePractitioners } = pendingItem;

  if (!filedBy)
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.other];

  if (filedBy.startsWith('Resp. &')) {
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.joint];
  }

  if (filedBy === 'Resp.') {
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.respondent];
  }

  if (filedBy.includes('Intv')) {
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.other];
  }

  if (filedBy.startsWith('Petrs.') || filedBy.startsWith('Petr.')) {
    return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.petitioner];
  }

  if (Array.isArray(privatePractitioners) && privatePractitioners.length > 0) {
    return ACTION_FILED_BY_OPTIONS_INVERTED[
      ACTION_FILED_BY_OPTIONS.practitioner
    ];
  }

  return ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.other];
};
