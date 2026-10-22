import { Button } from '@web-client/dawson-ui/ui/button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ClerkOfCourtHtmlViewProps = {
  title: string;
};

const clerkOfCourtHtmlViewDeps = {
  buildHtmlTableDocumentHelper: state.buildHtmlTableDocumentHelper,
};

/**
 * Renders the open cases by type section, which has no chart: a heading and an
 * HTML view button that opens buildHtmlTableDocumentHelper's table in a new tab.
 */
export const ClerkOfCourtHtmlView = connect<
  ClerkOfCourtHtmlViewProps,
  typeof clerkOfCourtHtmlViewDeps
>(
  clerkOfCourtHtmlViewDeps,
  function ClerkOfCourtHtmlView({ buildHtmlTableDocumentHelper, title }) {
    const openHtmlTable = () => {
      const blob = new Blob(
        [buildHtmlTableDocumentHelper.openCasesByTypeHtmlDocument],
        { type: 'text/html' },
      );
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
