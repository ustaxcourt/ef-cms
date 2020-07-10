import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EligibleCases = connect(
  {
    formattedEligibleCases:
      state.formattedTrialSessionDetails.formattedEligibleCases,
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
          <div className="float-right text-semibold margin-top-neg-3 margin-bottom-2">
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
              <th aria-label="Docket Number">Docket No.</th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>Petitioner Counsel</th>
              <th>Respondent Counsel</th>
              <th>Case Type</th>
              {trialSessionDetailsHelper.showQcComplete && (
                <th>QC Complete?</th>
              )}
            </tr>
          </thead>
          {formattedEligibleCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <CaseLink formattedCase={item} />
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
                  {item.privatePractitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td>{item.respondent}</td>
                <td>{item.caseType}</td>
                {trialSessionDetailsHelper.showQcComplete && (
                  <td>
                    <div className="text-center">
                      <input
                        aria-label="qc complete"
                        checked={
                          item.qcCompleteForTrial[trialSessionId] === true
                        }
                        className="usa-checkbox__input"
                        id={`${item.caseId}-complete`}
                        name={`${item.caseId}Complete`}
                        type="checkbox"
                        onChange={() => {
                          updateQcCompleteForTrialSequence({
                            caseId: item.caseId,
                            qcCompleteForTrial: !item.qcCompleteForTrial[
                              trialSessionId
                            ],
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label inline-block"
                        htmlFor={`${item.caseId}-complete`}
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
