import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import PropTypes from 'prop-types';

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
class App extends React.Component {
  componentDidUpdate() {
    document.querySelector('#app').focus();
  }
  render() {
    const CurrentPage = pages[this.props.currentPage];
    return (
      <React.Fragment>
        <UsaBanner />
        <Header />
        <main tabIndex="-1" id="main-content">
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
