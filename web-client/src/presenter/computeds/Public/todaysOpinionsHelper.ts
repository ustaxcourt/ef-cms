import { state } from '@web-client/presenter/app-public.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const todaysOpinionsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const todaysOpinions = get(state.todaysOpinions);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MONTH_DAY_YEAR');

  const formattedOpinions = todaysOpinions.map(opinion => ({
    ...opinion,
    formattedFilingDate: applicationContext
      .getUtilities()
      .formatDateString(opinion.filingDate, 'MMDDYY'),
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(opinion.judge || opinion.signedJudgeName),
    numberOfPagesFormatted: opinion.numberOfPages ?? 'n/a',
  }));

  return { formattedCurrentDate, formattedOpinions };
};
