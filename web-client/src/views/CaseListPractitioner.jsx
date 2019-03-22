import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPractitioner = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardPetitionerHelper,
  },
  ({ caseList, helper }) => {
    helper.showCaseList = true;
    const renderTable = () => (
      <table className="responsive-table dashboard" id="case-list">
        <thead>
          <tr>
            <th>Docket Number</th>
            <th>Date Filed</th>
            <th>Case Name</th>
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
                <span className="responsive-label">Case Name</span>
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
        className={'usa-button ' + (helper.showCaseList ? 'new-case' : '')}
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
        <div className="usa-grid-full case-list-header">
          <div className="usa-width-one-half">
            <h2>Your Cases</h2>
          </div>
          <div className="usa-width-one-half">{renderStartButton()}</div>
        </div>
        {renderTable()}
      </React.Fragment>
    );

    return (
      <>
        <div className="usa-grid-full subsection">
          <div className="usa-width-two-thirds">
            {helper.showCaseList ? renderNonEmptyState() : renderEmptyState()}
          </div>
        </div>
      </>
    );
  },
);
