import { BigHeader } from '../BigHeader';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ErrorNotification } from '../ErrorNotification';
import { SelectCriteria } from './SelectCriteria';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const BlockedCasesReport = connect(
  {
    blockedCasesReportHelper: state.blockedCasesReportHelper,
    form: state.form,
  },
  ({ blockedCasesReportHelper, form }) => (
    <>
      <BigHeader text="Reports" />
      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <Tabs bind="reportTab" defaultActiveTab="BlockedCases">
          <Tab
            id="reports-blocked-cases-tab"
            tabName="BlockedCases"
            title="Blocked Cases"
          >
            <div className="grid-row grid-gap">
              <div className="grid-col-3">
                <SelectCriteria />
              </div>
              <div className="grid-col-9">
                {form.trialLocation && (
                  <>
                    <div className="grid-row">
                      <div className="grid-col-6">
                        <h2>{form.trialLocation}</h2>
                      </div>
                      <div className="grid-col-6 text-right margin-top-1">
                        <span className="text-semibold">
                          Count: {blockedCasesReportHelper.blockedCasesCount}
                        </span>
                      </div>
                    </div>
                    {blockedCasesReportHelper.blockedCasesCount > 0 && (
                      <table className="usa-table row-border-only subsection work-queue deadlines">
                        <thead>
                          <tr>
                            <th>Docket</th>
                            <th>Date blocked</th>
                            <th>Case name</th>
                            <th>Case status</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blockedCasesReportHelper.blockedCasesFormatted.map(
                            (item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <CaseLink formattedCase={item} />
                                </td>
                                <td>{item.blockedDateFormatted}</td>
                                <td>{item.caseName}</td>
                                <td>{item.status}</td>
                                <td>{item.blockedReason}</td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    )}
                    {blockedCasesReportHelper.blockedCasesCount === 0 && (
                      <p>There are no blocked cases for this location.</p>
                    )}
                  </>
                )}
                {!form.trialLocation && (
                  <p className="margin-0 text-semibold">
                    Select a trial location to view blocked cases
                  </p>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </section>
    </>
  ),
);
