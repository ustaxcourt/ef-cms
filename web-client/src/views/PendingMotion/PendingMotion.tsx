import { AddEditDocketEntryWorksheetModal } from '@web-client/views/PendingMotion/AddEditDocketEntryWorksheetModal';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const pendingMotionsDeps = {
  navigateToPathSequence: sequences.navigateToPathSequence,
  openAddEditDocketEntryWorksheetModalSequence:
    sequences.openAddEditDocketEntryWorksheetModalSequence,
  pendingMotionsHelper: state.pendingMotionsHelper,
  showModal: state.modal.showModal,
};

export const PendingMotion = connect<
  { isReadOnly?: boolean; showJudgeColumn?: boolean },
  typeof pendingMotionsDeps
>(
  pendingMotionsDeps,
  function PendingMotion({
    isReadOnly,
    navigateToPathSequence,
    openAddEditDocketEntryWorksheetModalSequence,
    pendingMotionsHelper,
    showJudgeColumn,
    showModal,
  }) {
    return (
      <>
        <div>
          Showing motions pending for 180 days or more. To view all, run the{' '}
          <Button
            link
            overrideMargin="margin-0"
            onClick={() =>
              navigateToPathSequence({
                path: '/reports/pending-report',
              })
            }
          >
            Pending Report
          </Button>
          .
        </div>
        <div
          className="float-right margin-bottom-2 text-semibold"
          data-testid="pending-motions-total-count-text"
        >
          Count: {pendingMotionsHelper.formattedPendingMotions.length}
        </div>

        <table className="usa-table ustc-table">
          <thead>
            <tr>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th>Docket No.</th>
              <th>No. of Cases</th>
              {showJudgeColumn && <th style={{ width: '12rem' }}>Judge</th>}
              <th style={{ width: '12rem' }}>Petitioner(s)</th>
              <th>Motion</th>
              <th>Days Pending</th>
              <th>Final Brief Due Date</th>
              <th>Status of Matter</th>
              {!isReadOnly && <th aria-hidden="true"></th>}
            </tr>
          </thead>
          <tbody>
            {pendingMotionsHelper.formattedPendingMotions.map(motion => {
              return (
                <React.Fragment key={`info-${motion.docketEntryId}`}>
                  <tr
                    data-testid={`pending-motion-row-${motion.docketEntryId}`}
                  >
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
                    {showJudgeColumn && <td>{motion.judge}</td>}
                    <td>{motion.caseCaption}</td>
                    <td>
                      <a
                        href={motion.documentLink}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {motion.documentTitle}
                      </a>
                    </td>
                    <td>{motion.daysSinceCreated}</td>
                    <td>{motion.finalBriefDueDateFormatted}</td>
                    <td>
                      {motion.docketEntryWorksheet.formattedStatusOfMatter}
                    </td>
                    {!isReadOnly && (
                      <td>
                        <Button
                          link
                          data-testid="add-edit-pending-motion-worksheet"
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
                    )}
                  </tr>
                  <tr
                    data-testid={`pending-motion-row-${motion.docketEntryId}-primary-issue`}
                  >
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
          <div>There are no motions pending for 180 days or more.</div>
        )}

        {showModal === 'AddEditDocketEntryWorksheetModal' && (
          <AddEditDocketEntryWorksheetModal />
        )}
      </>
    );
  },
);

PendingMotion.displayName = 'PendingMotion';
