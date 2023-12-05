import { BigHeader } from '../BigHeader';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SelectCriteria } from './SelectCriteria';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const BlockedCasesReport = connect(
  {
    blockedCasesReportHelper: state.blockedCasesReportHelper,
    form: state.form,
  },
  function BlockedCasesReport({ blockedCasesReportHelper, form }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Blocked Cases</h1>
          </div>
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
                    <table className="usa-table subsection ustc-table deadlines">
                      <thead>
                        <tr>
                          <th
                            aria-hidden="true"
                            className="consolidated-case-column"
                          ></th>
                          <th aria-label="Docket Number" className="small">
                            <span className="padding-left-2px">Docket No.</span>
                          </th>
                          <th>Date Blocked</th>
                          <th>Case Title</th>
                          <th>Case Status</th>
                          <th>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blockedCasesReportHelper.blockedCasesFormatted.map(
                          item => (
                            <tr key={item.docketNumber}>
                              <td className="consolidated-case-column">
                                {item.inConsolidatedGroup && (
                                  <span
                                    className="fa-layers fa-fw"
                                    title={item.consolidatedIconTooltipText}
                                  >
                                    <Icon
                                      aria-label={
                                        item.consolidatedIconTooltipText
                                      }
                                      className="fa-icon-blue"
                                      icon="copy"
                                    />
                                    {item.isLeadCase && (
                                      <span className="fa-inverse lead-case-icon-text">
                                        L
                                      </span>
                                    )}
                                  </span>
                                )}
                              </td>
                              <td>
                                <CaseLink formattedCase={item} />
                              </td>
                              <td>{item.blockedDateEarliest}</td>
                              <td>{item.caseTitle}</td>
                              <td>{item.status}</td>
                              <td>
                                {item.blockedReason}
                                {item.blockedReason &&
                                  item.automaticBlockedReason && <br />}
                                {item.automaticBlockedReason}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  )}
                  {blockedCasesReportHelper.displayMessage && (
                    <p>{blockedCasesReportHelper.displayMessage}</p>
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
        </section>
      </>
    );
  },
);

BlockedCasesReport.displayName = 'BlockedCasesReport';
