import {
  formatDocketEntry,
  getFilingsAndProceedings,
} from '@shared/business/utilities/getFormattedCaseDetail';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const getDocumentTitleForNoticeOfChange = ({
  applicationContext,
  docketEntry,
}: {
  applicationContext: ServerApplicationContext;
  docketEntry: any;
}): string => {
  let { documentTitle } = docketEntry;
  const filingsAndProceedings = getFilingsAndProceedings(
    formatDocketEntry(applicationContext, docketEntry),
  );

  documentTitle = `${documentTitle} ${
    docketEntry.additionalInfo || ''
  } ${filingsAndProceedings} ${docketEntry.additionalInfo2 || ''}`
    .trim()
    .replace('   ', ' ')
    .replace('  ', ' ');

  return documentTitle;
};
