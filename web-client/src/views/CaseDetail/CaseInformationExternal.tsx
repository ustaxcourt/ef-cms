import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCases } from './CaseInformation/ConsolidatedCases';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { If } from '../../ustc-ui/If/If';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const CaseDetails = ({ caseDetail, caseDetailHelper }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Notice/case type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="tablet:grid-col-6">
        <p className="label">Case procedure</p>
        <p>{caseDetail.procedureType} Tax Case</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">IRS notice date</p>
        <p>{caseDetail.irsNoticeDateFormatted}</p>
      </div>
      {caseDetailHelper.showFilingFeeExternal && (
        <div className="tablet:grid-col-6">
          <p className="label">Filing fee*</p>
          <p>{caseDetail.filingFee}</p>
        </div>
      )}
    </div>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Requested place of trial</p>
        <p>{caseDetail.formattedPreferredTrialCity}</p>
      </div>
    </div>
    {caseDetailHelper.showFilingFeeExternal && (
      <span data-testid="filling-fee-message">
        *Filing fee status may take 2-3 business days from payment received date
        or approval of waiver to update
      </span>
    )}
  </React.Fragment>
);

const TrialInformation = ({ caseDetail }) => (
  <React.Fragment>
    {caseDetail.formattedTrialDate && (
      <>
        <div className="grid-row">
          <div className="tablet:grid-col-4">
            <p className="label">Place of trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="tablet:grid-col-4">
            <p className="label">Trial date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="tablet:grid-col-4">
            <p className="label">Trial judge</p>
            <p>{caseDetail.formattedAssociatedJudge}</p>
          </div>
        </div>
      </>
    )}
    {!caseDetail.formattedTrialDate && (
      <p>This case is not scheduled for trial</p>
    )}
  </React.Fragment>
);

export const CaseInformationExternal = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
  },
  function CaseInformationExternal({
    caseDetailHelper,
    formattedCaseDetail,
    navigateToPrintableCaseConfirmationSequence,
  }) {
    return (
      <div className="petitions-details">
        <NonMobile>
          <div className="grid-container padding-x-0 margin-top-5">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">
                      Case Details
                      <If bind="formattedCaseDetail.showPrintConfirmationLink">
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
                          Print Confirmation
                        </Button>
                      </If>
                    </h3>
                    <CaseDetails
                      caseDetail={formattedCaseDetail}
                      caseDetailHelper={caseDetailHelper}
                    />
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
            <div className="grid-row grid-gap margin-top-4">
              <div className="tablet:grid-col-6">
                {caseDetailHelper.showConsolidatedCasesCard && (
                  <div className="card height-full">
                    <div className="content-wrapper">
                      <h3 className="underlined">Consolidated Cases</h3>
                      <ConsolidatedCases
                        caseDetail={formattedCaseDetail}
                        caseDetailHelper={caseDetailHelper}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </NonMobile>
        <Mobile>
          <div className="grid-container padding-x-0 margin-top-3">
            <div className="margin-top-2">
              <div className="case-info-card padding-bottom-3">
                <h3>Case Details</h3>{' '}
                <If bind="formattedCaseDetail.showPrintConfirmationLink">
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
                    Print Confirmation
                  </Button>
                </If>
                <CaseDetails
                  caseDetail={formattedCaseDetail}
                  caseDetailHelper={caseDetailHelper}
                />
              </div>
            </div>
            <div className="margin-top-2">
              <div className="case-info-card">
                <h3>Trial Information</h3>
                <TrialInformation caseDetail={formattedCaseDetail} />
              </div>
            </div>
            {caseDetailHelper.showConsolidatedCasesCard && (
              <div className="margin-top-2">
                <div className="case-info-card">
                  <h3>Consolidated Cases</h3>
                  <ConsolidatedCases
                    caseDetail={formattedCaseDetail}
                    caseDetailHelper={caseDetailHelper}
                  />
                </div>
              </div>
            )}
          </div>
        </Mobile>
      </div>
    );
  },
);

CaseInformationExternal.displayName = 'CaseInformationExternal';
