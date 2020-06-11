import { Error } from './Error';
import { Footer } from './Footer';
import { HeaderPublic } from './Header/HeaderPublic';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { PublicCaseDetail } from './Public/PublicCaseDetail';
import { PublicPrintableDocketRecord } from './Public/PublicPrintableDocketRecord';
import { PublicSearch } from './Public/PublicSearch';
import { TodaysOpinions } from './Public/TodaysOpinions';
import { UsaBanner } from './UsaBanner';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect } from 'react';

const pages = {
  Error,
  Interstitial,
  PublicCaseDetail,
  PublicPrintableDocketRecord,
  PublicSearch,
  TodaysOpinions,
};

/**
 * Root application component for the public site
 */
export const AppComponentPublic = connect(
  {
    currentPage: state.currentPage,
  },
  function AppComponentPublic({ currentPage }) {
    const focusMain = e => {
      e && e.preventDefault();
      const header = document.querySelector('#main-content h1');
      if (header) header.focus();
      return;
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
        <UsaBanner />
        <HeaderPublic />
        <main id="main-content" role="main">
          <CurrentPage />
        </main>
        <Footer />
        <Loading />
      </React.Fragment>
    );
  },
);
