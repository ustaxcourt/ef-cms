import { Button } from '@web-client/dawson-ui/ui/button';
import { ClerkOfCourtHtmlTable } from '@web-client/presenter/computeds/Dashboard/buildHtmlTableDocumentHelper';
import { connect } from '@web-client/presenter/shared.cerebral';
import { renderToStaticMarkup } from 'react-dom/server';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

/** The standalone document that the HTML view opens; React escapes all text */
const HtmlTableDocument = ({
  labelHeader,
  rows,
  title,
  totalHeader,
}: ClerkOfCourtHtmlTable) => (
  <html lang="en">
    <head>
      <title>{title}</title>
    </head>
    <body>
      <h2>{title}</h2>
      <table border={1} cellPadding={4} cellSpacing={0}>
        <thead>
          <tr>
            <th>{labelHeader}</th>
            <th>{totalHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, total }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </body>
  </html>
);

type ClerkOfCourtHtmlViewProps = {
  title: string;
};

const clerkOfCourtHtmlViewDeps = {
  buildHtmlTableDocumentHelper: state.buildHtmlTableDocumentHelper,
};

/**
 * Renders the open cases by type section, which has no chart: a heading and an
 * HTML view button that opens the table values from buildHtmlTableDocumentHelper in a new tab.
 */
export const ClerkOfCourtHtmlView = connect<
  ClerkOfCourtHtmlViewProps,
  typeof clerkOfCourtHtmlViewDeps
>(
  clerkOfCourtHtmlViewDeps,
  function ClerkOfCourtHtmlView({ buildHtmlTableDocumentHelper, title }) {
    const openHtmlTable = () => {
      const html = `<!DOCTYPE html>${renderToStaticMarkup(
        <HtmlTableDocument
          {...buildHtmlTableDocumentHelper.openCasesByTypeTable}
        />,
      )}`;
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
  },
);

ClerkOfCourtHtmlView.displayName = 'ClerkOfCourtHtmlView';
