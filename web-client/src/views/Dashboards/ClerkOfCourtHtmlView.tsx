import { Button } from '@web-client/dawson-ui/ui/button';
import { buildHtmlTableDocument } from '@web-client/business/utilities/buildHtmlTableDocument';
import { ClerkOfCourtTableRow } from '@web-client/presenter/clerkOfCourtDashboardState';
import React from 'react';

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
