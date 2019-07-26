import { DocketRecord } from './DocketRecord/DocketRecord';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import seal from '../images/ustc_seal.svg';

export const CaseDetailInternalPrint = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
  },
  ({ caseDetail, caseHelper }) => {
    return (
      <>
        <div className="print-view">
          <section className="print-header margin-bottom-3">
            <div className="grid-container">
              <div className="grid-row margin-top-3 margin-bottom-3">
                <div className="grid-col-2">
                  <div className="usa-logo">
                    <img alt="USTC Seal" src={seal} />
                  </div>
                </div>
                <div className="grid-col-8">
                  <h2 className="margin-bottom-0 text-align-center margin-top-4">
                    United States Tax Court
                  </h2>
                  <h3 className="text-align-center">Docket Record</h3>
                </div>
                <div className="grid-col-2" />
              </div>
              <div className="grid-row margin-top-3 margin-bottom-3">
                <div className="grid-col-4 text-align-left">
                  {caseDetail.caseCaption}
                </div>
                <div className="grid-col-4" />
                <div className="grid-col-4" />
              </div>
              <div className="grid-row">
                <div className="grid-col-6 text-align-left">
                  {caseHelper.caseCaptionPostfix}
                </div>
                <div className="grid-col-6 text-align-right">
                  Docket Number: {caseDetail.docketNumberWithSuffix}
                </div>
              </div>
              <div className="grid-row text-align-left margin-top-4">
                <div className="grid-col-12">
                  <PartyInformation />
                  <DocketRecord />
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  },
);
