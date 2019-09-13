import { CaseSearchBox } from './CaseSearchBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyContactInformation } from './MyContactInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListPractitioner = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    formattedCases: state.formattedCases,
  },
  ({ dashboardExternalHelper, formattedCases }) => {
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
            {formattedCases.map(item => (
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

    const renderStartButton = () => (
      <a
        className={
          'usa-button tablet-full-width margin-right-0 ' +
          (dashboardExternalHelper.showCaseList ? 'new-case' : '')
        }
        href="/file-a-petition/step-1"
        id="init-file-petition"
      >
        <FontAwesomeIcon icon="file" size="1x" /> File a Petition
      </a>
    );

    const renderEmptyState = () => (
      <React.Fragment>
        {renderTitle()}
        <p>You are not associated with any cases.</p>
        <div className="button-box-container">{renderStartButton()}</div>
      </React.Fragment>
    );

    const renderNonEmptyState = () => (
      <React.Fragment>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2>My Cases</h2>
            </div>
            <div className="tablet:grid-col-6 mobile:grid-col-12 text-right">
              {renderStartButton()}
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
              {dashboardExternalHelper.showCaseList
                ? renderNonEmptyState()
                : renderEmptyState()}
            </div>
            <div className="tablet:grid-col-4">
              {dashboardExternalHelper.showCaseSearch && <CaseSearchBox />}
              <MyContactInformation />
            </div>
          </div>
        </div>
      </>
    );
  },
);
