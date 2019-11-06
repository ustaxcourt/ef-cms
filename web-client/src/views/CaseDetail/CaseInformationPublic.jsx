import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PetitionDetails = ({ caseDetail }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Petition Fee Paid</p>
        <p>{caseDetail.payGovId}</p>
      </div>
    </div>
  </React.Fragment>
);

const TrialInformation = ({ caseDetail }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Place of trial</p>
        <p>{caseDetail.formattedTrialCity}</p>
      </div>
      <div className="tablet:grid-col-6">
        <p className="label">Trial date</p>
        <p>{caseDetail.formattedTrialDate}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Trial judge</p>
        <p>{caseDetail.formattedAssociatedJudge}</p>
      </div>
    </div>
  </React.Fragment>
);

export const CaseInformationPublic = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
  },
  ({ formattedCaseDetail, navigateToPrintableCaseConfirmationSequence }) => {
    return (
      <div className="petitions-details">
        <div className="grid-container padding-x-0">
          <NonMobile>
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">
                      Petition Details
                      <If bind="caseDetail.irsSendDate">
                        <Button
                          link
                          className="margin-right-0 margin-top-1 padding-0 float-right"
                          onClick={() => {
                            navigateToPrintableCaseConfirmationSequence({
                              docketNumber: formattedCaseDetail.docketNumber,
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            className="margin-right-05"
                            icon="print"
                            size="1x"
                          />
                          Print receipt
                        </Button>
                      </If>
                    </h3>
                    <PetitionDetails caseDetail={formattedCaseDetail} />
                  </div>
                </div>
              </div>
              <div className="grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">Trial Information</h3>
                    <TrialInformation caseDetail={formattedCaseDetail} />
                  </div>
                </div>
              </div>
            </div>
          </NonMobile>
          <Mobile>
            <div className="margin-top-2">
              <div className="case-info-card">
                <h3 className="underlined">Petition Details</h3>{' '}
                <If bind="caseDetail.irsSendDate">
                  <Button
                    link
                    onClick={() => {
                      navigateToPrintableCaseConfirmationSequence({
                        docketNumber: formattedCaseDetail.docketNumber,
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      className="margin-right-05"
                      icon="print"
                      size="1x"
                    />
                    Print receipt
                  </Button>
                </If>
                <PetitionDetails caseDetail={formattedCaseDetail} />
              </div>
            </div>
            <div className="margin-top-2">
              <div className="case-info-card">
                <h3>Trial Information</h3>
                <TrialInformation caseDetail={formattedCaseDetail} />
              </div>
            </div>
          </Mobile>
        </div>
      </div>
    );
  },
);
