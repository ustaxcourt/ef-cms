import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PublicTrialSessionsRemoteProceedingsCard = connect(
  {},
  function () {
    return (
      <>
        <div className="card" data-testid="remote-proceedings-card">
          <div className="card-header padding-left-2 padding-top-2">
            <h2>Remote Proceedings</h2>
          </div>
          <div className="margin-left-2 margin-right-2 border-bottom-1px border-base-lighter"></div>
          <div className="card-content">
            <div className="padding-left-2 margin-bottom-3">
              <div>
                <Button
                  link
                  className="padding-bottom-0 text-left"
                  href="https://www.ustaxcourt.gov/remote_proceedings.html"
                >
                  Public Access to Remote Proceedings
                </Button>
              </div>
              <div>
                <Button
                  link
                  className="text-left"
                  href="https://www.ustaxcourt.gov/zoomgov.html"
                >
                  Zoomgov Proceedings Resources
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
