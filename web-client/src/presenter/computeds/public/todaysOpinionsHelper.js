import { state } from 'cerebral';

export const todaysOpinionsHelper = (get, applicationContext) => {
  const todaysOpinions = get(state.todaysOpinions);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MMMM D, YYYY');

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
