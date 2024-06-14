import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const addCourtIssuedDocketEntryNonstandardHelper = (
  get,
  applicationContext,
): any => {
  const { COURT_ISSUED_EVENT_CODES, TRANSCRIPT_EVENT_CODE } =
    applicationContext.getConstants();

  const form = get(state.form);
  const selectedEventCode = form.eventCode;

  const selectedDocumentInformation = COURT_ISSUED_EVENT_CODES.find(
    entry => entry.eventCode === selectedEventCode,
  );

  let minDate;
  let showDateFirst = false;
  let showDateLast = false;
  let showDocketNumbers = false;
  let showFreeText = false;
  let showOptionalFreeText = false;
  let showJudge = false;
  let showTrialLocation = false;

  if (selectedDocumentInformation) {
    switch (selectedDocumentInformation.scenario) {
      case 'Type A':
        showFreeText = true;
        break;
      case 'Type B':
        showFreeText = true;
        showJudge = true;
        break;
      case 'Type C':
        showDocketNumbers = true;
        break;
      case 'Type D':
        minDate = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);
        showFreeText = true;
        showDateFirst = true;
        break;
      case 'Type E':
        showDateFirst = true;
        break;
      case 'Type F':
        showOptionalFreeText = true;
        showJudge = true;
        showTrialLocation = true;
        break;
      case 'Type G':
        showDateFirst = true;
        showTrialLocation = true;
        break;
      case 'Type H':
        showFreeText = true;
        showDateLast = true;
        break;
    }
  }

  let freeTextLabel;
  if (selectedEventCode === 'O') {
    freeTextLabel = 'What is this order for?';
  } else if (selectedEventCode === 'NOT') {
    freeTextLabel = 'What is this notice for?';
  } else {
    freeTextLabel = 'Description';
  }

  let dateLabel = 'Date';
  if (selectedEventCode === TRANSCRIPT_EVENT_CODE) {
    dateLabel = 'Date of trial/hearing';
  } else if (form.scenario === 'Type G') {
    dateLabel = 'Trial date';
  }

  return {
    dateLabel,
    freeTextLabel,
    minDate,
    showDateFirst,
    showDateLast,
    showDocketNumbers,
    showFreeText,
    showJudge,
    showOptionalFreeText,
    showTrialLocation,
  };
};
