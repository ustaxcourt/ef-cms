import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import { CaseSearchBox } from './CaseSearchBox.jsx';

export const CaseListRespondent = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardExternalHelper,
  },
  ({ caseList, helper }) => {
    const renderTable = () => (
      <div className="margin-top-2">
        <table className="usa-table responsive-table dashboard" id="case-list">
          <thead>
            <tr>
              <th>Docket Number</th>
              <th>Case Name</th>
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
                <td className="hide-on-mobile">{item.caseName}</td>
                <td>{item.createdAtFormatted}</td>
                <td className="show-on-mobile">
                  <div>
                    <a href={'/case-detail/' + item.docketNumber}>
                      {item.docketNumberWithSuffix}
                    </a>
                  </div>
                  {item.caseName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderTitle = () => <h2>My Cases</h2>;

    const renderEmptyState = () => (
      <React.Fragment>
        {renderTitle()}
        <p>You are not associated with any cases.</p>
      </React.Fragment>
    );

    const renderNonEmptyState = () => (
      <React.Fragment>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2>My Cases</h2>
            </div>
          </div>
        </div>
        <div className="padding-top-205 show-on-mobile">
          <h2>My Cases</h2>
        </div>
        {renderTable()}
      </React.Fragment>
    );

    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap-6">
            <div className="tablet:grid-col-8">
              {helper.showCaseList ? renderNonEmptyState() : renderEmptyState()}
            </div>
            <div className="tablet:grid-col-4">
              <CaseSearchBox />
            </div>
          </div>
        </div>
      </>
    );
  },
);
