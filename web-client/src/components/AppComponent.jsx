import React from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';

import UsaBanner from './UsaBanner';
import Header from './Header';
import Footer from './Footer';

/**
 * Root application component
 */
export default connect(
  {
    response: state.response,
    getHello: sequences.getHello,
  },
  function AppComponent({ response, getHello }) {
    return (
      <React.Fragment>
        <UsaBanner />
        <Header />
        <main id="main-content">
          <section className="usa-section usa-grid">
            <h2>Hello World!</h2>
            <p>
              <button id="hello-button" onClick={() => getHello()}>
                Hello?
              </button>
            </p>
            <p id="response">{response}</p>
          </section>
        </main>
        <Footer />
      </React.Fragment>
    );
  },
);
