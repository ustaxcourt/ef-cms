import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addEditCaseWorksheetModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): { title: string } => {
  const { docketNumber } = get(state.form);

  const { submittedAndCavCasesByJudge = [] } = get(state.submittedAndCavCases);

  const subjectCase = submittedAndCavCasesByJudge.find(
    aCase => aCase.docketNumber === docketNumber,
  );

  const caseTitle = applicationContext.getCaseTitle(subjectCase?.caseCaption);

  const title = `Docket ${docketNumber}: ${caseTitle}`;

  return {
    title,
  };
};
