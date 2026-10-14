import { Button } from '@web-client/dawson-ui/ui/button';
import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import { escape } from 'lodash';
import React from 'react';

/**
 * Renders a dashboard section that has no chart: a heading and an HTML view
 * button that opens the section's data as a table in a new tab.
 */
export const ClerkOfCourtHtmlView = ({
  labelHeader,
  rows,
  title,
  totalHeader = 'Total',
}: {
  labelHeader: string;
  rows: ClerkOfCourtTableRow[];
  title: string;
  totalHeader?: string;
}) => {
  const openHtmlTable = () => {
    const tableRows = rows
      .map(
        ({ label, total }) =>
          `<tr><td>${escape(label)}</td><td>${escape(total)}</td></tr>`,
      )
      .join('');
    const html = `<html><body><h2>${escape(title)}</h2><table border="1" cellpadding="4" cellspacing="0"><thead><tr><th>${escape(labelHeader)}</th><th>${escape(totalHeader)}</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
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
