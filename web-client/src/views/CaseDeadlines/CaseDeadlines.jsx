import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDeadlines = connect(
  { helper: state.caseDeadlineReportHelper },
  ({ helper }) => (
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
            <h2>{helper.formattedFilterDate}</h2>
            <p>Count: {helper.caseDeadlineCount}</p>
            <table className="usa-table row-border-only subsection deadlines">
              <tbody>
                {helper.caseDeadlines.map((item, idx) => (
                  <tr key={idx}>
                    <td className="smaller-column center-column semi-bold">
                      {item.formattedDeadline}
                    </td>
                    <td className="smaller-column center-column semi-bold">
                      <a href={'/case-detail/' + item.docketNumber}>
                        {item.formattedDocketNumber}
                      </a>
                    </td>
                    <td className="padding-extra">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </section>
    </>
  ),
);
