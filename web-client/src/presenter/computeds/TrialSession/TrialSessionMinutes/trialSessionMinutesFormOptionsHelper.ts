import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionMinutesFormOptionsHelper = (
  get: Get,
): { filteredIrsPractitionerOptions: { label: string; value: string }[] } => {
  const irsPractitionerOptions = get(
    state.minuteSheetForm.options.irsPractitionerOptions,
  );
  const currentRespondentNames = Object.values(
    get(state.minuteSheetForm.respondentsSection.respondents),
  ).map(respondent => respondent.name);

  const filteredIrsPractitionerOptions = irsPractitionerOptions.filter(
    option => !currentRespondentNames.includes(option.value),
  );

  return {
    filteredIrsPractitionerOptions,
  };
};
