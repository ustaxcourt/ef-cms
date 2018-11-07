import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import FilePetition from './FilePetition';
import Footer from './Footer';
import Header from './Header';
import Dashboard from './Dashboard';
import LogIn from './LogIn';
import StyleGuide from './StyleGuide';
import UsaBanner from './UsaBanner';
import CaseDetail from './CaseDetail';

const pages = {
  CaseDetail,
  Dashboard,
  LogIn,
  FilePetition,
  StyleGuide,
};

/**
 * Root application component
 */
export default connect(
  {
    currentPage: state.currentPage,
  },
  function App({ currentPage }) {
    const CurrentPage = pages[currentPage];
    return (
      <React.Fragment>
        <a tabIndex="0" className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>
        <UsaBanner />
        <Header />
        <main id="main-content">
          <CurrentPage />
        </main>
        <Footer />
      </React.Fragment>
    );
  },
);
