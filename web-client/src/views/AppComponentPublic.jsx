import { Contact } from './Contact';
import { Error } from './Error';
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
import { UsaBanner } from './UsaBanner';
import { applicationContextPublic } from '../applicationContextPublic';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import { useScript } from '../utilities/useScript';
import React, { useEffect } from 'react';

const pages = {
  Contact,
  Error,
  HealthCheck,
  Interstitial,
  Privacy,
  PublicCaseDetail,
  PublicPrintableDocketRecord,
  PublicSearch,
  TodaysOpinions,
};

const featureShowFooter = applicationContextPublic.isCodeEnabled(7142);

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
      if (!featureShowFooter) {
        const templateDateElement = document.getElementById('last-deployed');
        templateDateElement.classList.remove('hide');
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

        {featureShowFooter && <Footer />}
      </React.Fragment>
    );
  },
);
