import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import close from '../../../../node_modules/uswds/dist/img/close.svg';
import seal from '../../images/ustc_seal.svg';

const BetaBar = toggleBetaBarSequence => {
  return (
    <div className="beta">
      <div className="grid-container">
        <div className="grid-row">
          <div className="grid-col-10">
            This is a testing site for the U.S. Tax Court and not intended for
            public use. To learn more about starting a case, visit the{' '}
            <a href="https://www.ustaxcourt.gov/">U.S. Tax Court website</a>.
          </div>
          <div className="grid-col-2">
            <button
              className="button-icon float-right"
              onClick={() => toggleBetaBarSequence()}
            >
              <img
                alt="close"
                className="ustc-icon-square--small"
                src={close}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeaderPublic = connect(
  {
    navigateToCognitoSequence: sequences.navigateToCognitoSequence,
    showBetaBar: state.header.showBetaBar,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
  },
  function HeaderPublic({
    navigateToCognitoSequence,
    showBetaBar,
    toggleBetaBarSequence,
  }) {
    return (
      <div className="header-public">
        {showBetaBar && BetaBar(toggleBetaBarSequence)}
        <div className="grid-container no-mobile-padding">
          <header
            className="usa-header usa-header--basic ustc-header"
            role="banner"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <div className="usa-logo">
                  <a href="/">
                    <img alt="USTC Seal" src={seal} />
                  </a>
                </div>
                <h1 className="header-welcome-public">
                  Welcome to the U.S. Tax Court’s Case Management System
                </h1>
                <div className="login-container">
                  <Button
                    className="usa-button--unstyled"
                    icon={['far', 'user']}
                    onClick={() => navigateToCognitoSequence()}
                  >
                    Log In
                  </Button>
                </div>
                <div className="login-container mobile">
                  <button
                    className="usa-menu-btn"
                    onClick={() => navigateToCognitoSequence()}
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
    );
  },
);
