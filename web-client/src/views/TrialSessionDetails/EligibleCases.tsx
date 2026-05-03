import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
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
              <th aria-label="Icons for consolidated and/or sealed cases"></th>
              <th aria-label="Docket Number">Docket No.</th>
              <th aria-label="Manually added indicator"></th>
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
          {formattedEligibleCases.map(eligibleCase => (
            <tbody key={eligibleCase.docketNumber}>
              <tr
                className={classNames({
                  'aged-cases': eligibleCase.isAgedCase,
                })}
                data-testid={`table-row-${eligibleCase.docketNumber}`}
              >
                <td>
                  <CaseIcons formattedCase={eligibleCase} />
                </td>
                <td>
                  <span
                    className={classNames({
                      'margin-left-2': eligibleCase.shouldIndent,
                    })}
                  >
                    <CaseLink formattedCase={eligibleCase} />
                  </span>
                </td>
                <td>
                  {eligibleCase.isManuallyAdded && (
                    <WrappedIcon
                      iconAriaLabel="Manually added indicator"
                      iconClass="mini-success"
                      icon="calendar-plus"
                      title="Manually added"
                    />
                  )}
                </td>
                <td>{eligibleCase.caseCaption}</td>
                <td>
                  {eligibleCase.privatePractitioners.map(practitioner => (
                    <div key={practitioner.userId}>{practitioner.name}</div>
                  ))}
                </td>
                <td>
                  {eligibleCase.irsPractitioners.map(practitioner => (
                    <div key={practitioner.userId}>{practitioner.name}</div>
                  ))}
                </td>
                <td>{eligibleCase.caseType}</td>
                <td>
                  <PreformattedText text={eligibleCase.calendarNotes} />
                </td>
                {trialSessionDetailsHelper.showQcComplete && (
                  <td>
                    <div className="text-center">
                      <input
                        aria-label="qc complete"
                        checked={
                          trialSessionId
                            ? eligibleCase.qcCompleteForTrial[
                                trialSessionId
                              ] === true
                            : false
                        }
                        className="usa-checkbox__input"
                        data-testid={`qc-complete-${eligibleCase.docketNumber}`}
                        id={`qc-complete-${eligibleCase.docketNumber}`}
                        name={`${eligibleCase.docketNumber}Complete`}
                        type="checkbox"
                        onChange={() => {
                          updateQcCompleteForTrialSequence({
                            docketNumber: eligibleCase.docketNumber,
                            qcCompleteForTrial: trialSessionId
                              ? !eligibleCase.qcCompleteForTrial[trialSessionId]
                              : false,
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor={`qc-complete-${eligibleCase.docketNumber}`}
                      >
                        {''}
                      </label>
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
