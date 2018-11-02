import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import FilePetition from './FilePetition';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import LogIn from './LogIn';
import StyleGuide from './StyleGuide';
import UsaBanner from './UsaBanner';

const pages = {
  Home,
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
