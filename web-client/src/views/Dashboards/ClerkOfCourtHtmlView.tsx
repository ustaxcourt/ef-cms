import { Button } from '@web-client/dawson-ui/ui/button';
import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import { escape } from 'lodash';
import React from 'react';

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

/**
 * Renders a dashboard section that has no chart: a heading and an HTML view
 * button that opens the section's data as a table in a new tab.
 */
export const ClerkOfCourtHtmlView = ({
  htmlTitle,
  labelHeader,
  rows,
  title,
  totalHeader = 'Total',
}: {
  /** heading for the HTML view table, when it differs from the title */
  htmlTitle?: string;
  labelHeader: string;
  rows: ClerkOfCourtTableRow[];
  title: string;
  totalHeader?: string;
}) => {
  const openHtmlTable = () => {
    const html = buildHtmlTableDocument({
      labelHeader,
      rows,
      title: htmlTitle ?? title,
      totalHeader,
    });
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank', 'noopener, noreferrer');
  };

  return (
    <div data-testid={`${title}-html-view-div`}>
      <h2 className="tw:xs:text-2xl tw:text-lg tw:mb-4">{title}</h2>
      <Button
        className="tw:w-auto"
        data-testid={`${title}-html-view-button`}
        variant="primaryTertiary"
        onClick={openHtmlTable}
      >
        HTML view
      </Button>
    </div>
  );
};
