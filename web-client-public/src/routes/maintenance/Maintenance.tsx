import { createRoute } from '@tanstack/react-router';
import React from 'react';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { rootRoute } from 'web-client-public/src/routes/PublicRoot';
const seal =
  require('../../../../web-client/src/images/ustc_seal.svg') as string;

export function Maintenance() {
  return (
    <>
      <section
        className="text-center maintenance-content"
        data-testid="maintenance-container"
      >
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
}

// eslint-disable-next-line custom-rules-plugin/no-new-dates
const updateTime = `${new Date().toLocaleString('en-US', {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'short',
  timeZone: 'America/New_York',
  weekday: 'short',
  year: 'numeric',
})} EST`;

export const maintenanceRoute = createRoute({
  path: '/maintenance',
  getParentRoute: () => rootRoute,
  component: Maintenance,
});
