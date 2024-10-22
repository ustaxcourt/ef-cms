import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const props = {
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
};

export const PublicTrialSessions = connect(
  props,
  function ({ publicTrialSessionsHelper }) {
    return (
      <>
        <BigHeader text="Scheduled Trial Sessions" />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-8 padding-top-2">
              <div className="grid-row">
                <div>
                  Information on this page is current as of{' '}
                  {publicTrialSessionsHelper.fetchedDateString}
                </div>
              </div>
            </div>
            <div className="grid-col-4 padding-top-1 card">
              <div className="card-header padding-left-2 padding-top-2 border-bottom-1px border-base-lighter">
                <h2>Remote Proceedings</h2>
              </div>
              <div className="card-content">
                <div className="padding-left-2 margin-bottom-2">
                  <Button
                    className="padding-bottom-0"
                    link="https://www.ustaxcourt.gov/remote_proceedings.html"
                  >
                    Public Access to Remote Proceedings
                  </Button>
                  <Button link="https://www.ustaxcourt.gov/zoomgov.html">
                    Zoomgov Proceedings Resources
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

PublicTrialSessions.displayName = 'PublicTrialSessions';
