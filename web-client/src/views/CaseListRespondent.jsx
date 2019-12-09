import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { CaseSearchBox } from './CaseSearchBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MyContactInformation } from './MyContactInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const getCaseRow = (formattedCase, isNestedCase) => {
  return (
    <React.Fragment key={formattedCase.caseId}>
      <tr>
        <td>
          {formattedCase.isLeadCase && (
            <>
              <span className="usa-sr-only">Lead Case</span>
              <FontAwesomeIcon
                className="margin-right-1 icon-consolidated"
                icon="copy"
                size="1x"
              />
            </>
          )}
        </td>
        <td className="hide-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} />
          </div>
        </td>
        <td className="hide-on-mobile">{formattedCase.caseName}</td>
        <td>{formattedCase.createdAtFormatted}</td>
        <td className="show-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} />
          </div>
          {formattedCase.caseName}
        </td>
      </tr>
      {formattedCase.consolidatedCases &&
        formattedCase.consolidatedCases.map(consolidatedCase =>
          getCaseRow(consolidatedCase, true),
        )}
    </React.Fragment>
  );
};

export const CaseListRespondent = connect(
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
              <th>
                <span className="usa-sr-only">Lead Case Indicator</span>
              </th>
              <th>Docket number</th>
              <th>Case name</th>
              <th>Date filed</th>
            </tr>
          </thead>
          <tbody>{formattedCases.map(item => getCaseRow(item))}</tbody>
        </table>
      </div>
    );

    const renderTitle = () => <h2>My Cases</h2>;

    const renderEmptyState = () => (
      <>
        {renderTitle()}
        <p>You are not associated with any cases.</p>
      </>
    );

    const renderNonEmptyState = () => (
      <>
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
      </>
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
              <CaseSearchBox />
              <MyContactInformation />
            </div>
          </div>
        </div>
      </>
    );
  },
);
