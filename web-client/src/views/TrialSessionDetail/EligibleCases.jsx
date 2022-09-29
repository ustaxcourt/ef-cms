import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EligibleCases = connect(
  {
    formattedEligibleCases:
      state.formattedTrialSessionDetailsForFilteredEligibleCases,
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
        {trialSessionDetailsHelper.showQcComplete && (
          <div className="float-right text-semibold margin-top-neg-3">
            Completed: {trialSessionDetailsHelper.eligibleCaseQcCompleteCount}
          </div>
        )}
        <table
          aria-describedby="eligible-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
        >
          <thead>
            <tr>
              <th></th>
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
                    <ConsolidatedCaseIcon caseItem={item} />
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
