import { Button } from '../../ustc-ui/Button/Button';
import { CaseListRowTrialSession } from './CaseListRowTrialSession';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WorkingCopyFilterHeader } from './WorkingCopyFilterHeader';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const WorkingCopySessionList = connect(
  {
    casesShownCount: state.trialSessionWorkingCopyHelper.casesShownCount,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialSessionWorkingCopy: state.trialSessionWorkingCopy,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
  },
  function WorkingCopySessionList({
    casesShownCount,
    sort,
    sortOrder,
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
                <Button
                  link
                  className="sortable-header-button margin-right-0"
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'docket',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'docket' && 'sortActive',
                    )}
                  >
                    Docket No.
                  </span>
                  {(sort === 'docket' && sortOrder === 'desc' && (
                    <FontAwesomeIcon
                      icon="caret-up"
                      title="in ascending order"
                    />
                  )) || (
                    <FontAwesomeIcon
                      icon="caret-down"
                      title="in descending order"
                    />
                  )}
                </Button>
              </th>
              <th aria-label="manually added indicator"></th>
              <th>Case Title</th>
              <th>
                <Button
                  link
                  className="sortable-header-button margin-right-0"
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'practitioner',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'practitioner' && 'sortActive',
                    )}
                  >
                    Petitioner Counsel
                  </span>
                  {(sort === 'practitioner' && sortOrder === 'desc' && (
                    <FontAwesomeIcon
                      icon="caret-up"
                      title="in ascending order"
                    />
                  )) || (
                    <FontAwesomeIcon
                      icon="caret-down"
                      title="in descending order"
                    />
                  )}
                </Button>
              </th>
              <th>Respondent Counsel</th>
              <th>PTM</th>
              <th colSpan="2">Trial Status</th>
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
        {casesShownCount === 0 && (
          <p>Please select a trial status to show cases.</p>
        )}
      </div>
    );
  },
);

WorkingCopySessionList.displayName = 'WorkingCopySessionList';
