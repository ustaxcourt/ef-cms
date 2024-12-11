import { KeyedPartyFormFieldsByRenderKey } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { applicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const initializeTrialSessionMinutesSheetFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { caseDetail, trialSession } = props;

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
  const actionsAndFilingsRenderKey = uuidv4();
  const petitionerWitnessRowRenderKey = uuidv4();
  const respondentWitnessRowRenderKey = uuidv4();
  const exhibitRowRenderKey = uuidv4();

  store.set(state.minuteSheetForm.caseMetadata.recalled[recalledRowRenderKey], {
    date: '',
    note: '',
    renderKey: recalledRowRenderKey,
    transcriptOrdered: false,
  });
  store.set(
    state.minuteSheetForm.petitioners.petitioners,
    getPetitionersFromCase(caseDetail),
  );
  store.set(
    state.minuteSheetForm.respondents.respondents,
    getRespondentsFromCase(caseDetail),
  );
  store.set(state.minuteSheetForm.motionsSection.motions[motionRowRenderKey], {
    date: '',
    filedBy: '',
    note: '',
    oralMotion: false,
    renderKey: motionRowRenderKey,
    status: '',
    type: '',
  });
  store.set(
    state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings[
      actionsAndFilingsRenderKey
    ],
    {
      date: '',
      documentType: '',
      filedBy: '',
      note: '',
      renderKey: actionsAndFilingsRenderKey,
      status: '',
    },
  );
  store.set(
    state.minuteSheetForm.witnesses.petitionerWitnesses[
      petitionerWitnessRowRenderKey
    ],
    {
      name: '',
      renderKey: petitionerWitnessRowRenderKey,
    },
  );
  store.set(
    state.minuteSheetForm.witnesses.respondentWitnesses[
      respondentWitnessRowRenderKey
    ],
    {
      name: '',
      renderKey: respondentWitnessRowRenderKey,
    },
  );
  store.set(state.minuteSheetForm.exhibits.exhibits[exhibitRowRenderKey], {
    description: '',
    note: '',
    renderKey: exhibitRowRenderKey,
    status: '',
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

  if (petitioners && petitioners.length > 0) {
    petitioners.forEach(obj => {
      const renderKey = uuidv4();
      keyedPartyFormFieldsByRenderKey[renderKey] = {
        datesOfAppearance: '',
        name: obj.name,
        renderKey,
        role: '', // TODO figure out how to do this
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
