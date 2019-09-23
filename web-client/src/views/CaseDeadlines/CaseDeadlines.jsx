import { BigHeader } from '../BigHeader';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { DateSelectCalendar } from './DateSelectCalendar';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDeadlines = connect(
  { caseDeadlineReportHelper: state.caseDeadlineReportHelper },
  ({ caseDeadlineReportHelper }) => (
    <>
      <BigHeader text="Reports" />
      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <Tabs bind="reportTab" defaultActiveTab="Deadlines">
          <Tab
            id="reports-caseDeadlines-tab"
            tabName="Deadlines"
            title="Deadlines"
          >
            <div className="grid-row grid-gap">
              <div className="grid-col-3">
                <DateSelectCalendar />
              </div>
              <div className="grid-col-9">
                <div className="grid-row">
                  <div className="grid-col-6">
                    <h2>
                      {caseDeadlineReportHelper.formattedFilterDateHeader}
                    </h2>
                  </div>
                  <div className="grid-col-6 text-right margin-top-1">
                    <span className="text-semibold">
                      Count: {caseDeadlineReportHelper.caseDeadlineCount}
                    </span>
                  </div>
                </div>
                <table className="usa-table row-border-only subsection work-queue deadlines">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th>Docket</th>
                      <th>Case name</th>
                      <th>Description</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab>
        </Tabs>
      </section>
    </>
  ),
);
