import { CaseListRowTrialSession } from './CaseListRowTrialSession';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import { WorkingCopyFilterHeader } from './WorkingCopyFilterHeader';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const WorkingCopySessionList = connect(
  {
    constants: state.constants,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialSessionWorkingCopy: state.trialSessionWorkingCopy,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
  },
  function WorkingCopySessionList({
    constants,
    toggleWorkingCopySortSequence,
    trialSessionWorkingCopy,
    trialSessionWorkingCopyHelper,
  }) {
    return (
      <div className="margin-top-4">
        <WorkingCopyFilterHeader />
        <table
          aria-describedby="tab-my-queue"
          className="usa-table ustc-table subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th>
                <span className="usa-sr-only">Consolidated Case Indicator</span>
              </th>
              <th
                aria-label="Docket Number"
                className="padding-left-2px no-wrap"
              >
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={trialSessionWorkingCopy.sort}
                  currentlySortedOrder={trialSessionWorkingCopy.sortOrder}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={
                    trialSessionWorkingCopyHelper.formattedCases.length > 0
                  }
                  sortField="docket"
                  title="Docket No."
                  onClickSequence={toggleWorkingCopySortSequence}
                />
              </th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={trialSessionWorkingCopy.sort}
                  currentlySortedOrder={trialSessionWorkingCopy.sortOrder}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={
                    trialSessionWorkingCopyHelper.formattedCases.length > 0
                  }
                  sortField="practitioner"
                  title="Petitioner Counsel"
                  onClickSequence={toggleWorkingCopySortSequence}
                />
              </th>
              <th>Respondent Counsel</th>
              <th>PTM</th>
              <th colSpan={2}>Trial Status</th>
            </tr>
          </thead>
          <tbody>
            {trialSessionWorkingCopyHelper.formattedCases.map(item => {
              return (
                <CaseListRowTrialSession
                  formattedCase={item}
                  key={item.docketNumber}
                  trialSessionWorkingCopy={trialSessionWorkingCopy}
                />
              );
            })}
          </tbody>
        </table>
        {trialSessionWorkingCopyHelper.casesShownCount === 0 && (
          <p>Please select a trial status to show cases.</p>
        )}
      </div>
    );
  },
);

WorkingCopySessionList.displayName = 'WorkingCopySessionList';
