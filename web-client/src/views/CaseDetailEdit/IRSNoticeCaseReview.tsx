import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const IRSNoticeCaseReview = connect(
  {
    form: state.form,
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
  },
  function IRSNotice({ form, reviewSavedPetitionHelper }) {
    return (
      <>
        <div className="tablet:grid-col-7 margin-bottom-4">
          <div className="card height-full margin-bottom-0">
            <div className="content-wrapper">
              <h3 className="underlined" id="irs-notice-card">
                IRS Notice
                <Button
                  link
                  aria-label="edit IRS notice information"
                  className="margin-right-0 margin-top-1 padding-0 float-right"
                  href={`/case-detail/${form.docketNumber}/petition-qc?tab=irsNotice`}
                  icon="edit"
                >
                  Edit
                </Button>
              </h3>
              <div className="grid-row grid-gap margin-bottom-4">
                <div className="grid-col-4">
                  <div>
                    <span className="usa-label usa-label-display margin-bottom-0">
                      IRS Notice provided?
                    </span>
                    {reviewSavedPetitionHelper.hasIrsNoticeFormatted}
                  </div>
                </div>
                <div className="grid-col-4">
                  <span className="usa-label usa-label-display">
                    Type of notice/case
                  </span>
                  {form.caseType}
                </div>
                <div className="grid-col-4">
                  {reviewSavedPetitionHelper.shouldShowIrsNoticeDate && (
                    <div>
                      <span className="usa-label usa-label-display">
                        Date of notice
                      </span>
                      {reviewSavedPetitionHelper.irsNoticeDateFormatted}
                    </div>
                  )}
                </div>
              </div>
              {reviewSavedPetitionHelper.showStatistics && (
                <>
                  <h4>Statistics</h4>
                  <table className="usa-table ustc-table responsive-table">
                    <thead>
                      <tr>
                        <th>Year/Period</th>
                        <th>Deficiency</th>
                        <th>Total penalties</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewSavedPetitionHelper.formattedStatistics.map(
                        statistic => (
                          <tr
                            key={`${statistic.formattedDate}-${statistic.formattedIrsDeficiencyAmount}`}
                          >
                            <td>{statistic.formattedDate}</td>
                            <td>{statistic.formattedIrsDeficiencyAmount}</td>
                            <td>{statistic.formattedIrsTotalPenalties}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },
);

IRSNoticeCaseReview.displayName = 'IRSNoticeCaseReview';
