import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect({}, function PartiesInformation() {
  return (
    <>
      <div className="grid-row grid-gap-5">
        <div className="grid-col-4">
          <div className="border border-base-lighter">
            <div className="grid-row padding-left-205 grid-header">
              Parties & Counsel
            </div>
            <div className="">
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Petitioner(s) & Counsel
                </div>
              </Button>
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Intervenor/Participants & Counsel
                </div>
              </Button>
              <Button
                className={classNames(
                  'usa-button--unstyled attachment-viewer-button',
                )}
              >
                <div className="grid-row margin-left-205">
                  Respondent Counsel
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export { PartiesInformation };
