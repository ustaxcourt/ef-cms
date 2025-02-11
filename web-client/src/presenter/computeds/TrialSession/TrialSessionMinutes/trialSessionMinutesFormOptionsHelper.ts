import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { Judge } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

type JudgeOptions = Record<string, Judge>;

export const trialSessionMinutesFormOptionsHelper = (
  get: Get,
): {
  filteredIrsPractitionerOptions: { label: string; value: string }[];
  judgeOptions: JudgeOptions;
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

  return {
    filteredIrsPractitionerOptions,
    judgeOptions,
  };
};
