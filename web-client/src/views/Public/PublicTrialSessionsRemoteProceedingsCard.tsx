import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const PublicTrialSessionsRemoteProceedingsCard = connect(
  {},
  function () {
    return (
      <>
        <div className="card">
          <div className="card-header padding-left-2 padding-top-2 border-bottom-1px border-base-lighter">
            <h2>Remote Proceedings</h2>
          </div>
          <div className="card-content ">
            <div className="padding-left-2 margin-bottom-2">
              <Button
                className="padding-bottom-0 text-left"
                link="https://www.ustaxcourt.gov/remote_proceedings.html"
              >
                Public Access to Remote Proceedings
              </Button>
              <Button
                className="text-left"
                link="https://www.ustaxcourt.gov/zoomgov.html"
              >
                Zoomgov Proceedings Resources
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  },
);
