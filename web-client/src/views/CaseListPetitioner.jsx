import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPetitioner = connect(
  {
    caseList: state.formattedCases,
  },
  ({ caseList }) => {
    return (
      <>
        <div className="usa-grid-full subsection">
          <div className="usa-width-one-half">
            <h2>Your Cases</h2>
          </div>
          <div className="usa-width-one-half">
            <a
              className="usa-button new-case"
              href="/before-starting-a-case"
              id="init-file-petition"
            >
              Start a New Case
            </a>
          </div>
        </div>
        <table className="responsive-table dashboard" id="case-list">
          <thead>
            <tr>
              <th>Docket Number</th>
              <th>Date Filed</th>
              <th>Petitioner Name</th>
            </tr>
          </thead>
          <tbody>
            {caseList.map(item => (
              <tr key={item.docketNumber}>
                <td className="responsive-title">
                  <span className="responsive-label">Docket Number</span>
                  <a href={'/case-detail/' + item.docketNumber}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>
                  <span className="responsive-label">Date Filed</span>
                  {item.createdAtFormatted}
                </td>
                <td>
                  <span className="responsive-label">Petitioner Name</span>
                  {item.petitionerName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
);
