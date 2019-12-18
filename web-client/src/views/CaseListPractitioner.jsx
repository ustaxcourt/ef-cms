import { Button } from '../ustc-ui/Button/Button';
import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { CaseSearchBox } from './CaseSearchBox';
import { MyContactInformation } from './MyContactInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
              <th>Docket number</th>
              <th>Case name</th>
              <th>Date filed</th>
            </tr>
          </thead>
          <tbody>
            {formattedCases.map(item => (
              <tr key={item.docketNumber}>
                <td className="hide-on-mobile">
                  <CaseLink formattedCase={item} />
                </td>
                <td className="hide-on-mobile">{item.caseName}</td>
                <td>{item.createdAtFormatted}</td>
                <td className="show-on-mobile">
                  <div>
                    <CaseLink formattedCase={item} />
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
      <Button
        className={classNames(
          'tablet-full-width margin-right-0',
          dashboardExternalHelper.showCaseList && 'new-case',
        )}
        href="/file-a-petition/step-1"
        icon="file"
        id="file-a-petition"
      >
        File a Petition
      </Button>
    );

    const renderEmptyState = () => (
      <React.Fragment>
        {renderTitle()}
        <p className="margin-bottom-5">
          You are not associated with any cases.
        </p>
        {renderStartButton()}
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
