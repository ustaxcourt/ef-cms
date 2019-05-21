import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2 className="margin-0">Your Cases</h2>
            </div>
            <div className="tablet:grid-col-6">
              <a
                className="usa-button new-case tablet-full-width float-right"
                href="/before-starting-a-case"
                id="init-file-petition"
              >
                <FontAwesomeIcon icon="file" size="1x" /> File a Petition
              </a>
            </div>
          </div>
        </div>
        <div className="show-on-mobile">
          <h2>Your Cases</h2>
        </div>
        <table className="usa-table responsive-table dashboard" id="case-list">
          <thead>
            <tr>
              <th>Docket Number</th>
              <th>Petitioner Name</th>
              <th>Date Filed</th>
            </tr>
          </thead>
          <tbody>
            {caseList.map(item => (
              <tr key={item.docketNumber}>
                <td className="hide-on-mobile">
                  <a href={'/case-detail/' + item.docketNumber}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>
                  <div className="show-on-mobile">
                    <a href={'/case-detail/' + item.docketNumber}>
                      {item.docketNumberWithSuffix}
                    </a>
                  </div>
                  {item.caseName}
                </td>
                <td>{item.createdAtFormatted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  },
);
