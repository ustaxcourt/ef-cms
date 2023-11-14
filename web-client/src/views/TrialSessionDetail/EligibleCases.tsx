import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const EligibleCases = connect(
  {
    formattedEligibleCases: state.formattedEligibleCasesHelper,
    trialSessionDetailsHelper: state.trialSessionDetailsHelper,
    trialSessionId: state.trialSession.trialSessionId,
    updateQcCompleteForTrialSequence:
      sequences.updateQcCompleteForTrialSequence,
  },
  function EligibleCases({
    formattedEligibleCases,
    trialSessionDetailsHelper,
    trialSessionId,
    updateQcCompleteForTrialSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-row float-right text-semibold margin-bottom-2">
          {trialSessionDetailsHelper.showSmallAndRegularQcComplete && (
            <div className="grid-row">
              <div className="margin-right-50 margin-right-mobile">
                Regular:{' '}
                <span className="font-weight-normal">
                  {
                    trialSessionDetailsHelper.eligibleRegularCaseQcTotalCompleteCount
                  }
                </span>
              </div>
              <div className="margin-right-50 margin-right-mobile">
                Small:{' '}
                <span className="font-weight-normal">
                  {
                    trialSessionDetailsHelper.eligibleSmallCaseQcTotalCompleteCount
                  }
                </span>
              </div>
            </div>
          )}
          {trialSessionDetailsHelper.showQcComplete && (
            <div>
              Total Completed:{' '}
              <span className="font-weight-normal">
                {trialSessionDetailsHelper.eligibleTotalCaseQcCompleteCount}
              </span>
            </div>
          )}
        </div>
        <table
          aria-describedby="eligible-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
        >
          <thead>
            <tr>
              <th aria-label="consolidated group indicator"></th>
              <th aria-label="Docket Number">Docket No.</th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
              <th>Case Type</th>
              <th>Calendar Notes</th>
              {trialSessionDetailsHelper.showQcComplete && (
                <th>QC Complete?</th>
              )}
            </tr>
          </thead>
          {formattedEligibleCases.map(item => (
            <tbody key={item.docketNumber}>
              <tr className="eligible-cases-row">
                <td>
                  <span
                    className={classNames({
                      'margin-left-2': item.shouldIndent,
                    })}
                  >
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        item.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={item.inConsolidatedGroup}
                      showLeadCaseIcon={item.isLeadCase}
                    />
                  </span>
                </td>
                <td>
                  <span
                    className={classNames({
                      'margin-left-2': item.shouldIndent,
                    })}
                  >
                    <CaseLink formattedCase={item} />
                  </span>
                </td>
                <td>
                  {item.isManuallyAdded && (
                    <span aria-label="manually added indicator">
                      <FontAwesomeIcon
                        className="mini-success"
                        icon="calendar-plus"
                      />
                    </span>
                  )}
                </td>
                <td>{item.caseCaption}</td>
                <td>
                  {item.privatePractitioners.map(practitioner => (
                    <div key={practitioner.userId}>{practitioner.name}</div>
                  ))}
                </td>
                <td>
                  {item.irsPractitioners.map(practitioner => (
                    <div key={practitioner.userId}>{practitioner.name}</div>
                  ))}
                </td>
                <td>{item.caseType}</td>
                <td>
                  <div>{item.calendarNotes}</div>
                </td>
                {trialSessionDetailsHelper.showQcComplete && (
                  <td>
                    <div className="text-center">
                      <input
                        aria-label="qc complete"
                        checked={
                          item.qcCompleteForTrial[trialSessionId] === true
                        }
                        className="usa-checkbox__input"
                        id={`${item.docketNumber}-complete`}
                        name={`${item.docketNumber}Complete`}
                        type="checkbox"
                        onChange={() => {
                          updateQcCompleteForTrialSequence({
                            docketNumber: item.docketNumber,
                            qcCompleteForTrial:
                              !item.qcCompleteForTrial[trialSessionId],
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor={`${item.docketNumber}-complete`}
                      ></label>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
        {formattedEligibleCases.length === 0 && (
          <p>There are no eligible cases.</p>
        )}
      </React.Fragment>
    );
  },
);

EligibleCases.displayName = 'EligibleCases';
