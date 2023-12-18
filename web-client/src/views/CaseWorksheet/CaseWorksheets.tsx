import { AddEditCaseWorksheetModal } from './AddEditCaseWorksheetModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseWorksheets = connect(
  {
    caseWorksheetsHelper: state.caseWorksheetsHelper,
    openAddEditCaseWorksheetModalSequence:
      sequences.openAddEditCaseWorksheetModalSequence,
    showModal: state.modal.showModal,
  },
  function CaseWorksheets({
    caseWorksheetsHelper,
    openAddEditCaseWorksheetModalSequence,
    showModal,
  }) {
    return (
      <div className="margin-top-6">
        <div className="grid-container padding-0 margin-bottom-3">
          <div className="grid-row">
            <div className="display-flex flex-align-end flex-justify-end grid-col-12">
              <span className="text-semibold">
                Count: {caseWorksheetsHelper.caseWorksheetsFormatted.length}
              </span>
            </div>
          </div>
        </div>

        <table className="usa-table ustc-table">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>No. of Cases</th>
              <th>Petitioner(s)</th>
              <th>Case Status</th>
              <th>Days in Status</th>
              <th>Status Date</th>
              <th>Final Brief Due Date</th>
              <th>Status of Matter</th>
              <th aria-hidden="true"></th>
            </tr>
          </thead>
          <tbody>
            {caseWorksheetsHelper.caseWorksheetsFormatted.map(formattedCase => {
              return (
                <React.Fragment key={`info-${formattedCase.docketNumber}`}>
                  <tr>
                    <td className="consolidated-case-column">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          formattedCase.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={formattedCase.inConsolidatedGroup}
                        showLeadCaseIcon={formattedCase.isLeadCase}
                      />
                    </td>
                    <td>
                      <CaseLink
                        formattedCase={formattedCase}
                        rel="noopener noreferrer"
                        target="_blank"
                      />
                    </td>
                    <td>{formattedCase.formattedCaseCount}</td>
                    <td>{formattedCase.caseCaption}</td>
                    <td>{formattedCase.status}</td>
                    <td>{formattedCase.daysSinceLastStatusChange}</td>
                    <td>{formattedCase.formattedSubmittedCavStatusDate}</td>
                    <td>{formattedCase.finalBriefDueDateFormatted}</td>
                    <td>{formattedCase.worksheet?.statusOfMatter}</td>
                    <td>
                      <Button
                        link
                        data-testid="add-edit-case-worksheet"
                        icon="edit"
                        onClick={() => {
                          openAddEditCaseWorksheetModalSequence({
                            docketNumber: formattedCase.docketNumber,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td colSpan={7}>
                      <span className="text-semibold margin-right-1">
                        Primary Issue:
                      </span>
                      {formattedCase.worksheet?.primaryIssue}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {caseWorksheetsHelper.caseWorksheetsFormatted.length === 0 && (
          <div>
            There are no cases with a status of &quot;Submitted&quot; or
            &quot;CAV&quot;.
          </div>
        )}

        {showModal === 'AddEditCaseWorksheetModal' && (
          <AddEditCaseWorksheetModal />
        )}
      </div>
    );
  },
);

CaseWorksheets.displayName = 'CaseWorksheets';
