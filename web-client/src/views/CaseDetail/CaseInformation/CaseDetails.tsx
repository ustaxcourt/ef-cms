import { Button } from '../../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const CaseDetails = connect(
  {
    caseDetail: props.caseDetail,
    caseInformationHelper: props.caseInformationHelper,
    openCleanModalSequence: props.openCleanModalSequence,
  },
  function CaseDetails({
    caseDetail,
    caseInformationHelper,
    openCleanModalSequence,
  }) {
    return (
      <>
        <div className="grid-row">
          <div className="grid-col-6">
            <p className="label">Notice/case type</p>
            <p>{caseDetail.caseType}</p>
          </div>
          <div className="grid-col-6">
            <p className="label">Case procedure</p>
            <p>{caseDetail.procedureType} Tax Case</p>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-6">
            <p className="label">IRS notice date</p>
            <p className="irs-notice-date">
              {caseDetail.irsNoticeDateFormatted}
            </p>
          </div>
          <div className="grid-col-6">
            <p className="label">Filing fee</p>
            <p className="pay-gov-id-display margin-bottom-0">
              {caseDetail.filingFee}
            </p>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-6">
            <p className="label">Requested place of trial</p>
            <p className="margin-bottom-0">
              {caseDetail.formattedPreferredTrialCity}
            </p>
          </div>
          {caseInformationHelper.showSealCaseButton && (
            <div className="grid-col-6">
              <Button
                link
                className="red-warning"
                icon="lock"
                onClick={() => {
                  openCleanModalSequence({
                    showModal: 'SealCaseModal',
                  });
                }}
              >
                Seal Case
              </Button>
            </div>
          )}

          {caseInformationHelper.showUnsealCaseButton && (
            <div className="grid-col-6">
              <Button
                link
                className="red-warning"
                icon="unlock"
                onClick={() => {
                  openCleanModalSequence({
                    showModal: 'UnsealCaseModal',
                  });
                }}
              >
                Unseal Case
              </Button>
            </div>
          )}
        </div>
      </>
    );
  },
);

CaseDetails.displayName = 'CaseDetails';
