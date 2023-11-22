import { AddEditDocketEntryWorksheetModal } from '@web-client/views/PendingMotion/AddEditDocketEntryWorksheetModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PendingMotion = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    openAddEditDocketEntryWorksheetModalSequence:
      sequences.openAddEditDocketEntryWorksheetModalSequence,
    pendingMotionsHelper: state.pendingMotionsHelper,
    showModal: state.modal.showModal,
  },
  function PendingMotion({
    navigateToPathSequence,
    openAddEditDocketEntryWorksheetModalSequence,
    pendingMotionsHelper,
    showModal,
  }) {
    return (
      <>
        <span className="float-right">
          Count: {pendingMotionsHelper.formattedPendingMotions.length}
        </span>

        <span className="float-left">
          Showing motions pending for more than 180 days. To view all, run the{' '}
          <Button
            link
            onClick={() =>
              navigateToPathSequence({
                path: '/reports/pending-report',
              })
            }
          >
            Pending Report.
          </Button>
        </span>

        <table className="usa-table ustc-table">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th className="small">
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>No. of Cases</th>
              <th>Petitioner(s)</th>
              <th>Motion</th>
              <th>No. Days Pending</th>
              <th>Final Brief Due Date</th>
              <th>Status of Matter</th>
              <th aria-hidden="true"></th>
            </tr>
          </thead>
          <tbody>
            {pendingMotionsHelper.formattedPendingMotions.map(motion => {
              return (
                <React.Fragment key={`info-${motion.docketNumber}`}>
                  <tr>
                    <td className="consolidated-case-column">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          motion.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={motion.inConsolidatedGroup}
                        showLeadCaseIcon={motion.isLeadCase}
                      />
                    </td>
                    <td>
                      <CaseLink
                        formattedCase={motion}
                        rel="noopener noreferrer"
                        target="_blank"
                      />
                    </td>
                    <td>{motion.consolidatedGroupCount}</td>
                    <td>{motion.caseCaption}</td>
                    <td>{motion.documentTitle}</td>
                    <td>{motion.daysSinceCreated}</td>
                    <td>{motion.docketEntryWorksheet.finalBriefDueDate}</td>
                    <td>{motion.docketEntryWorksheet.statusOfMatter}</td>
                    <td>
                      <Button
                        link
                        data-testid="add-edit-case-worksheet"
                        icon="edit"
                        onClick={() =>
                          openAddEditDocketEntryWorksheetModalSequence({
                            docketEntryId: motion.docketEntryId,
                          })
                        }
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
                      {motion.docketEntryWorksheet.primaryIssue}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {pendingMotionsHelper.formattedPendingMotions.length === 0 && (
          <div>There are no motions pending for more than 180 days.</div>
        )}

        {showModal === 'AddEditDocketEntryWorksheetModal' && (
          <AddEditDocketEntryWorksheetModal />
        )}
      </>
    );
  },
);

PendingMotion.displayName = 'PendingMotion';
