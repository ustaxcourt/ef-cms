import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EligibleCases = connect(
  {
    formattedEligibleCases:
      state.formattedTrialSessionDetails.formattedEligibleCases,
  },
  ({ formattedEligibleCases }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="eligible-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="upcoming-sessions"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th aria-label="manually added indicator"></th>
              <th>Case title</th>
              <th>Petitioner counsel</th>
              <th>Respondent counsel</th>
              <th>Case type</th>
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
                  {item.practitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td>{item.respondent}</td>
                <td>{item.caseType}</td>
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
