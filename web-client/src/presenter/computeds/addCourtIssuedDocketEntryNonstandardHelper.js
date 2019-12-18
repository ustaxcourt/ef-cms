import { state } from 'cerebral';

export const addCourtIssuedDocketEntryNonstandardHelper = (
  get,
  applicationContext,
) => {
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();

  const selectedEventCode = get(state.form.eventCode);

  const selectedDocumentInformation = COURT_ISSUED_EVENT_CODES.find(
    entry => entry.eventCode === selectedEventCode,
  );

  let showDate = false;
  let showDocketNumbers = false;
  let showFreeText = false;
  let showJudge = false;

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
      showFreeText = true;
      showDate = true;
      break;
    case 'Type E':
      showDate = true;
      break;
  }

  return {
    showDate,
    showDocketNumbers,
    showFreeText,
    showJudge,
  };
};
