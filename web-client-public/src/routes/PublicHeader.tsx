import React, { useState } from 'react';
import closeImg from '../../../node_modules/@uswds/uswds/dist/img/usa-icons/close.svg';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { publicEnvironment } from 'web-client-public/src/environment/publicEnvironment';
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

export function PublicHeader() {
  const [betaBarIsOpen, setBetaBarIsOpen] = useState(true);
  const isProduction = publicEnvironment.env === 'prod';

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
              <div className="login-container padding-x-1">
                <a href={`${publicEnvironment.privateUrl}/login`}>
                  <FontAwesomeIcon
                    icon={['far', 'user']}
                    size="1x"
                    className="margin-right-05"
                  />
                  Log In
                </a>
              </div>
              <div className="login-container mobile">
                <Button
                  noMargin={true}
                  overrideMargin={true}
                  className={'margin-0'}
                  href={`${publicEnvironment.privateUrl}/login`}
                >
                  Log In
                </Button>
              </div>

              <div className="create-container">
                <a
                  data-testid="create-account-button"
                  href={`${publicEnvironment.privateUrl}/create-account/petitioner`}
                >
                  Create Account
                </a>
              </div>
              <div className="create-container mobile">
                <Button
                  noMargin={true}
                  overrideMargin={true}
                  className={'margin-0'}
                  href={`${publicEnvironment.privateUrl}/create-account/petitioner`}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
