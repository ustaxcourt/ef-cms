import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import PropTypes from 'prop-types';

import CaseDetail from './CaseDetail';
import Dashboard from './Dashboard';
import FilePetition from './FilePetition';
import Footer from './Footer';
import Header from './Header';
import IntakeClerkDashboard from './IntakeClerkDashboard';
import Loading from './Loading';
import LogIn from './LogIn';
import FileDocument from './FileDocument';
import PetitionsWorkQueue from './PetitionsWorkQueue';
import StyleGuide from './StyleGuide';
import UsaBanner from './UsaBanner';
import ValidateCase from './ValidateCase';

const pages = {
  CaseDetail,
  Dashboard,
  FilePetition,
  IntakeClerkDashboard,
  Loading,
  LogIn,
  FileDocument,
  PetitionsWorkQueue,
  StyleGuide,
  ValidateCase,
};

/**
 * Root application component
 */
class App extends React.Component {
  componentDidUpdate() {
    this.focusMain();
  }
  focusMain(e) {
    e && e.preventDefault();
    document.querySelector('#main-content h1').focus();
    return false;
  }
  render() {
    const CurrentPage = pages[this.props.currentPage];
    return (
      <React.Fragment>
        <a
          tabIndex="0"
          className="usa-skipnav"
          href="#main-content"
          onClick={this.focusMain}
        >
          Skip to main content
        </a>
        <UsaBanner />
        <Header />
        <main id="main-content" role="main">
          <CurrentPage />
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}
App.propTypes = {
  currentPage: PropTypes.string,
};

export default connect(
  {
    currentPage: state.currentPage,
  },
  App,
);
