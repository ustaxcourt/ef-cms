import { Error } from './Error';
import { Footer } from './Footer';
import { Interstitial } from './Interstitial';
import { PublicSearch } from './PublicSearch';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect } from 'react';

const pages = {
  Error,
  Interstitial,
  PublicSearch,
};

/**
 * Root application component for the public site
 */
export const AppComponentPublic = connect(
  {
    currentPage: state.currentPage,
    currentPageHeader: state.currentPageHeader,
  },
  ({ currentPage }) => {
    const focusMain = e => {
      e && e.preventDefault();
      const header = document.querySelector('#main-content h1');
      if (header) header.focus();
      return false;
    };

    useEffect(() => {
      focusMain();
    });

    const CurrentPage = pages[currentPage];

    return (
      <React.Fragment>
        <a
          className="usa-skipnav"
          href="#main-content"
          tabIndex="0"
          onClick={focusMain}
        >
          Skip to main content
        </a>
        <main id="main-content" role="main">
          <CurrentPage />
        </main>
        <Footer />
      </React.Fragment>
    );
  },
);
