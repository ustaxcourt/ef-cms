import React, { useState } from 'react';
import closeImg from '../../../node_modules/@uswds/uswds/dist/img/usa-icons/close.svg';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { applicationContextPublic } from '@web-client/applicationContextPublic';
import { useNavigate } from '@tanstack/react-router';
const seal = require('../../../web-client/src/images/ustc_seal.svg') as string;

const BetaBar = ({ closeBetaBar }: { closeBetaBar: () => void }) => {
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
            <button className="button-icon float-right" onClick={closeBetaBar}>
              <img alt="close" src={closeImg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function HeaderPublic() {
  const [betaBarIsOpen, setBetaBarIsOpen] = useState(true);
  const navigate = useNavigate();
  const isProduction =
    applicationContextPublic.getEnvironment().stage === 'prod';

  const showBetaBar = !isProduction && betaBarIsOpen;
  const isTerminalUser = false;

  return (
    <div className="header-public">
      {showBetaBar && <BetaBar closeBetaBar={() => setBetaBarIsOpen(false)} />}
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
              <div className="header-welcome-public">
                Welcome to DAWSON {isTerminalUser && ': US Tax Court Terminal'}
              </div>
              <div className="login-container">
                <a href={`${applicationContextPublic.getPrivateUrl()}/login`}>
                  Log In
                </a>
                <Button
                  className="usa-button--unstyled"
                  icon={['far', 'user']}
                  onClick={() => navigate({ href: '' })}
                >
                  Log In
                </Button>
              </div>
              <div className="login-container mobile">
                <button
                  className="usa-menu-btn"
                  // onClick={() => navigate({href})}
                >
                  Log In
                </button>
              </div>

              <div className="create-container">
                <Button
                  className="usa-button--unstyled"
                  data-testid="create-account-button"
                  // onClick={() => redirectToCreatePetitionerAccountSequence()}
                >
                  Create Account
                </Button>
              </div>
              <div className="create-container mobile">
                <button
                  className="usa-menu-btn"
                  // onClick={() => redirectToCreatePetitionerAccountSequence()}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
