import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import { CaseSearchBox } from './CaseSearchBox.jsx';

export const CaseListPractitioner = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardPetitionerHelper,
  },
  ({ caseList, helper }) => {
    const renderTable = () => (
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
    );

    const renderTitle = () => <h2>Your Cases</h2>;

    const renderStartButton = () => (
      <a
        className={
          'usa-button tablet-full-width ' +
          (helper.showCaseList ? 'new-case' : '')
        }
        href="/start-a-case"
        id="init-file-petition"
      >
        Start a New Case
      </a>
    );

    const renderEmptyState = () => (
      <React.Fragment>
        {renderTitle()}
        <p>You have not started any cases.</p>
        {renderStartButton()}
      </React.Fragment>
    );

    const renderNonEmptyState = () => (
      <React.Fragment>
        <div className="grid-container padding-x-0 case-list-header">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2>Your Cases</h2>
            </div>
            <div className="tablet:grid-col-6">{renderStartButton()}</div>
          </div>
        </div>
        <div className="show-on-mobile">
          <h2>Your Cases</h2>
        </div>
        {renderTable()}
      </React.Fragment>
    );

    return (
      <>
        <div className="grid-container padding-x-0 subsection">
          <div className="grid-row grid-gap-6">
            <div className="tablet:grid-col-8">
              {helper.showCaseList ? renderNonEmptyState() : renderEmptyState()}
            </div>
            <div className="tablet:grid-col-4">
              {helper.showCaseSearch && <CaseSearchBox />}
            </div>
          </div>
        </div>
      </>
    );
  },
);
