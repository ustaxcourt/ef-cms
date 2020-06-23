import { BigHeader } from '../BigHeader';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { DateSelectCalendar } from './DateSelectCalendar';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDeadlines = connect(
  {
    caseDeadlineReportHelper: state.caseDeadlineReportHelper,
    judgeFilter: state.screenMetadata.caseDeadlinesFilter.judge,
  },
  function CaseDeadlines({ caseDeadlineReportHelper, judgeFilter }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Deadlines</h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-3">
              <DateSelectCalendar />
            </div>
            <div className="grid-col-9">
              <div className="grid-row">
                <div className="grid-col-6">
                  <h2>{caseDeadlineReportHelper.formattedFilterDateHeader}</h2>
                </div>
                <div className="grid-col-6 text-right margin-top-1">
                  <span className="text-semibold">
                    Count: {caseDeadlineReportHelper.caseDeadlineCount}
                  </span>
                </div>
              </div>
              {(caseDeadlineReportHelper.caseDeadlines.length > 0 ||
                judgeFilter) && (
                <div className="grid-row grid-gap padding-bottom-1">
                  <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                    <h3 id="filterHeading">Filter by</h3>
                  </div>
                  <div className="grid-col-3">
                    <BindedSelect
                      ariaDescribedBy="case-deadlines-tab filterHeading"
                      ariaLabel="judge"
                      bind="screenMetadata.caseDeadlinesFilter.judge"
                      className="select-left"
                      id="judgeFilter"
                      name="judge"
                      placeHolder="- Judge -"
                    >
                      <option value="">-Judge-</option>
                      {caseDeadlineReportHelper.judges.map((judge, idx) => (
                        <option key={idx} value={judge}>
                          {judge}
                        </option>
                      ))}
                    </BindedSelect>
                  </div>
                </div>
              )}
              {caseDeadlineReportHelper.caseDeadlines.length > 0 && (
                <table className="usa-table row-border-only subsection work-queue deadlines">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th aria-label="docket number">Docket No.</th>
                      <th>Case Title</th>
                      <th>Description</th>
                      <th>Judge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseDeadlineReportHelper.caseDeadlines.map((item, idx) => (
                      <tr key={idx}>
                        <td className="smaller-column semi-bold">
                          {item.formattedDeadline}
                        </td>
                        <td className="smaller-column semi-bold">
                          <CaseLink formattedCase={item} />
                        </td>
                        <td>{item.caseTitle}</td>
                        <td className="padding-extra">{item.description}</td>
                        <td className="no-wrap">
                          {item.associatedJudgeFormatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {caseDeadlineReportHelper.caseDeadlines.length === 0 && (
                <p>There are no deadlines for the selected date(s).</p>
              )}
            </div>
          </div>
        </section>
      </>
    );
  },
);
