import { connect } from '@cerebral/react';
import React from 'react';
import seal from '../images/ustc_seal.svg';

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
      <div className="maintenance-footer">
        <div className="text-center">
          <p className="captioned">Check for real-time status updates.</p>
          <button
            link
            className="usa-button--outline"
            href="https://status.ustaxcourt.gov/"
          >
            View System Status
          </button>
        </div>
      </div>
    </>
  );
});
