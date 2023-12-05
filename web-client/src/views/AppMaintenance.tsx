import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
const seal = require('../images/ustc_seal.svg') as string;

// eslint-disable-next-line @miovision/disallow-date/no-new-date
const updateTime = `${new Date().toLocaleString('en-US', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  timeZone: 'America/New_York',
  weekday: 'short',
  year: 'numeric',
})} EST`;

export const AppMaintenance = connect(function AppMaintenance() {
  return (
    <>
      <section className="text-center maintenance-content">
        <div>
          <div className="usa-logo margin-5">
            <a href="/">
              <img alt="USTC Seal" src={seal} />
            </a>
          </div>

          <div className="maintenance-text">
            <h2>DAWSON is currently down for maintenance.</h2>
            <p>Updated {updateTime}</p>
          </div>
        </div>
      </section>
      <footer className="usa-footer usa-footer--slim maintenance-footer">
        <div className="text-center">
          <p className="captioned">Check for real-time status updates.</p>
          <Button
            className="usa-button--outline ustc-button--mobile-inline margin-bottom-2"
            href="https://status.ustaxcourt.gov/"
          >
            View System Status
          </Button>
        </div>
      </footer>
    </>
  );
});

AppMaintenance.displayName = 'AppMaintenance';
