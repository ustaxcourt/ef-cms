import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { getDocumentTypesForSelect } from '../internalTypesHelper';
import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
  COURT_ISSUED_EVENT_CODES,
  INTERNAL_DOCUMENTS_ARRAY,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

export const trialSessionMinutesHelper = (
  get: Get,
): { documentTypeOptions: any } => {
  const actionsAndFilingsState: MinuteSheetFormState['actionsAndFilingsSection']['actionsAndFilings'] =
    get(state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings);

  const rows = Object.values(actionsAndFilingsState);

  const internalDocumentTypeOptions = getDocumentTypesForSelect(
    INTERNAL_DOCUMENTS_ARRAY,
  );
  const eventCodes = COURT_ISSUED_EVENT_CODES;

  const courtIssuedDocumentTypeOptions = eventCodes.map(type => ({
    ...type,
    label: type.documentType,
    value: type.eventCode,
  }));

  const documentTypeOptions = {};
  rows.forEach(row => {
    documentTypeOptions[row.renderKey] =
      row.filedBy ===
      ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court]
        ? courtIssuedDocumentTypeOptions
        : internalDocumentTypeOptions;
  });

  return {
    documentTypeOptions,
  };
};
