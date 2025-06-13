import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { Judge } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { getDocumentTypesForSelect } from '../internalTypesHelper';
import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
  COURT_ISSUED_EVENT_CODES,
  INTERNAL_DOCUMENTS_ARRAY,
} from '@shared/business/entities/EntityConstants';

type JudgeOptions = Record<string, Judge>;

export const trialSessionMinutesFormOptionsHelper = (
  get: Get,
): {
  filteredIrsPractitionerOptions: { label: string; value: string }[];
  judgeOptions: JudgeOptions;
  documentTypeOptions: Record<string, Array<{ label: string; value: string }>>;
} => {
  const irsPractitionerOptions = get(
    state.minuteSheetForm.options.irsPractitionerOptions,
  );
  const currentRespondentNames = Object.values(
    get(state.minuteSheetForm.respondentsSection.respondents),
  ).map(respondent => respondent.name);

  const filteredIrsPractitionerOptions = irsPractitionerOptions.filter(
    option => !currentRespondentNames.includes(option.value),
  );

  const judgeOptions = get(state.minuteSheetForm.options.judgeOptions);

  const courtIssuedDocumentTypeOptions = COURT_ISSUED_EVENT_CODES.map(type => ({
    label: type.documentType,
    value: type.eventCode,
  }));

  const internalDocumentTypeOptions = getDocumentTypesForSelect(
    INTERNAL_DOCUMENTS_ARRAY,
  ).map(option => ({ label: option.label, value: option.value }));

  const actionsAndFilingsState: MinuteSheetFormState['actionsAndFilingsSection']['actionsAndFilings'] =
    get(state.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings);

  const documentTypeOptions = {};
  Object.values(actionsAndFilingsState).forEach(row => {
    documentTypeOptions[row.renderKey] =
      row.filedBy ===
      ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court]
        ? courtIssuedDocumentTypeOptions
        : internalDocumentTypeOptions;
  });

  return {
    filteredIrsPractitionerOptions,
    judgeOptions,
    documentTypeOptions,
  };
};
