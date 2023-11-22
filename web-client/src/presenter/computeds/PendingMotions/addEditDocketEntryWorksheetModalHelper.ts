import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addEditDocketEntryWorksheetModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): { title: string } => {
  const { docketEntryId, docketNumber } = get(state.form);

  const { docketEntries = [] } = get(state.pendingMotions);

  const subjectCase = docketEntries.find(
    aCase => aCase.docketEntryId === docketEntryId,
  );

  const caseTitle = applicationContext.getCaseTitle(subjectCase?.caseCaption);

  const title = `Docket ${docketNumber}: ${caseTitle}`;

  return {
    title,
  };
};
