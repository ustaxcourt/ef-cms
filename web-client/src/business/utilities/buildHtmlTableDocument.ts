import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import { escape } from 'lodash';

type HtmlTableOptions = {
  labelHeader: string;
  rows: ClerkOfCourtTableRow[];
  title: string;
  totalHeader: string;
};

/** Builds the standalone HTML document that the HTML view opens, escaping all text */
export const buildHtmlTableDocument = ({
  labelHeader,
  rows,
  title,
  totalHeader,
}: HtmlTableOptions): string => {
  const tableRows = rows
    .map(
      ({ label, total }) =>
        `<tr><td>${escape(label)}</td><td>${escape(total)}</td></tr>`,
    )
    .join('');
  const tableTitle = escape(title);
  return `<html lang="en"><head><title>${tableTitle}</title></head><body><h2>${tableTitle}</h2><table border="1" cellpadding="4" cellspacing="0"><thead><tr><th>${escape(labelHeader)}</th><th>${escape(totalHeader)}</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
};
