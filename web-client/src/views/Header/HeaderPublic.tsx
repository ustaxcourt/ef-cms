import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import closeImg from '../../../../node_modules/@uswds/uswds/dist/img/usa-icons/close.svg';
const seal = require('../../images/ustc_seal.svg') as string;

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
              <img alt="close" src={closeImg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeaderPublic = connect(
  {
    headerPublicHelper: state.headerPublicHelper,
    isTerminalUser: state.isTerminalUser,
    redirectToCreatePetitionerAccountSequence:
      sequences.redirectToCreatePetitionerAccountSequence,
    redirectToLoginSequence: sequences.redirectToLoginSequence,
    showBetaBar: state.templateHelper.showBetaBar,
    toggleBetaBarSequence: sequences.toggleBetaBarSequence,
  },
  function HeaderPublic({
    headerPublicHelper,
    isTerminalUser,
    redirectToCreatePetitionerAccountSequence,
    redirectToLoginSequence,
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
              <div className="usa-navbar usa-navbar-public">
                <div className="usa-logo">
                  <a href="/">
                    <img alt="USTC Seal" src={seal} />
                  </a>
                </div>
                <h1 className="header-welcome-public">
                  Welcome to DAWSON{' '}
                  {isTerminalUser && ': US Tax Court Terminal'}
                </h1>
                {!headerPublicHelper.onCreationPage && (
                  <>
                    <div className="login-container">
                      <Button
                        className="usa-button--unstyled"
                        icon={['far', 'user']}
                        onClick={() => redirectToLoginSequence()}
                      >
                        Log In
                      </Button>
                    </div>
                    <div className="login-container mobile">
                      <button
                        className="usa-menu-btn"
                        onClick={() => redirectToLoginSequence()}
                      >
                        Log In
                      </button>
                    </div>
                  </>
                )}
                {!headerPublicHelper.onCreationPage &&
                  !headerPublicHelper.onVerificationSentPage && (
                    <>
                      <div className="create-container">
                        <Button
                          className="usa-button--unstyled"
                          data-testid="create-account-button"
                          onClick={() =>
                            redirectToCreatePetitionerAccountSequence()
                          }
                        >
                          Create Account
                        </Button>
                      </div>
                      <div className="create-container mobile">
                        <button
                          className="usa-menu-btn"
                          onClick={() =>
                            redirectToCreatePetitionerAccountSequence()
                          }
                        >
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </header>
        </div>
      </div>
    );
  },
);

HeaderPublic.displayName = 'HeaderPublic';
