import { Contact } from './Contact';
import { EmailVerificationInstructions } from './Public/EmailVerificationInstructions';
import { EmailVerificationSuccess } from './Public/EmailVerificationSuccess';
import { ErrorView } from './Error';
import { Footer } from './Footer';
import { HeaderPublic } from './Header/HeaderPublic';
import { HealthCheck } from './Health/HealthCheck';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { Privacy } from './Privacy';
import { PublicCaseDetail } from './Public/PublicCaseDetail';
import { PublicPrintableDocketRecord } from './Public/PublicPrintableDocketRecord';
import { PublicSearch } from './Public/PublicSearch';
import { TodaysOpinions } from './Public/TodaysOpinions';
import { TodaysOrders } from './Public/TodaysOrders';
import { UsaBanner } from './UsaBanner';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import { useScript } from '../utilities/useScript';
import React, { useEffect } from 'react';

const pages = {
  Contact,
  EmailVerificationInstructions,
  EmailVerificationSuccess,
  ErrorView,
  HealthCheck,
  Interstitial,
  Privacy,
  PublicCaseDetail,
  PublicPrintableDocketRecord,
  PublicSearch,
  TodaysOpinions,
  TodaysOrders,
};

let initialPageLoaded = false;

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
      const header = window.document.querySelector('#main-content h1');
      if (header) header.focus();
      return;
    };

    useEffect(() => {
      if (initialPageLoaded) {
        focusMain();
      }
      if (currentPage !== 'Interstitial') {
        initialPageLoaded = true;
      }
    });

    if (!process.env.CI) {
      useScript('https://lynmjtcq5px1.statuspage.io/embed/script.js');
    }

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
        <Loading />

        <Footer />
      </React.Fragment>
    );
  },
);
