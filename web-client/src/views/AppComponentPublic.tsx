import { AppMaintenance } from './AppMaintenance';
import { Contact } from './Contact';
import { CreatePetitionerAccount } from './Public/CreatePetitionerAccount/CreatePetitionerAccount';
import { EmailVerificationInstructions } from './Public/EmailVerificationInstructions';
import { EmailVerificationSuccess } from './Public/EmailVerificationSuccess';
import { ErrorView } from './Error';
import { Footer } from './Footer';
import { HeaderPublic } from './Header/HeaderPublic';
import { HealthCheck } from './Health/HealthCheck';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { Login } from '@web-client/views/Public/Login/Login';
import { Privacy } from './Privacy';
import { PublicCaseDetail } from './Public/PublicCaseDetail';
import { PublicPrintableDocketRecord } from './Public/PublicPrintableDocketRecord';
import { PublicSearch } from './Public/PublicSearch';
import { TodaysOpinions } from './Public/TodaysOpinions';
import { TodaysOrders } from './Public/TodaysOrders';
import { UsaBanner } from './UsaBanner';
import { VerificationSent } from './Public/CreatePetitionerAccount/VerificationSent';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import { useScript } from '../utilities/useScript';
import React, { useEffect } from 'react';

const pages = {
  AppMaintenance,
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

const floatingCards = {
  CreatePetitionerAccount,
  Login,
  VerificationSent,
};

let initialPageLoaded = false;

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

    let showHeaderAndFooter = currentPage !== 'AppMaintenance';

    if (!process.env.CI) {
      useScript('https://lynmjtcq5px1.statuspage.io/embed/script.js');
    }

    const CurrentPage = pages[currentPage];
    const CurrentCardPage = floatingCards[currentPage];

    return (
      <React.Fragment>
        {showHeaderAndFooter && (
          <>
            <a
              className="usa-skipnav"
              href="#main-content"
              tabIndex={0}
              onClick={focusMain}
            >
              Skip to main content
            </a>
            <UsaBanner />
            <HeaderPublic />
          </>
        )}
        {CurrentPage && (
          <main id="main-content" role="main">
            <CurrentPage />
          </main>
        )}
        {CurrentCardPage && (
          <div className="floating-card-pages">
            <div className="padding-y-5 padding-x-5 display-flex flex-justify-center">
              <CurrentCardPage />
            </div>
          </div>
        )}
        <Loading />

        {showHeaderAndFooter && <Footer />}
      </React.Fragment>
    );
  },
);

AppComponentPublic.displayName = 'AppComponentPublic';
