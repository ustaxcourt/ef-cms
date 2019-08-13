import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const WorkingCopySessionList = connect(
  {
    sessions: state.trialSessionWorkingCopyHelper.formattedSessions,
    sort: state.trialSessionWorkingCopy.sort,
    sortOrder: state.trialSessionWorkingCopy.sortOrder,
    toggleWorkingCopySortSequence: sequences.toggleWorkingCopySortSequence,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  ({
    sessions,
    sort,
    sortOrder,
    toggleWorkingCopySortSequence,
    trialStatusOptions,
  }) => {
    return (
      <div className="margin-top-4">
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" className="padding-left-2px">
                <span
                  className={classNames(
                    ' margin-right-105',
                    sort === 'docket' && 'sortActive',
                  )}
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'docket',
                    });
                  }}
                >
                  Docket
                </span>
                {(sort === 'docket' && sortOrder === 'desc' && (
                  <FontAwesomeIcon icon="caret-up" />
                )) || <FontAwesomeIcon icon="caret-down" />}
              </th>
              <th>Case Caption</th>
              <th>
                <span
                  className={classNames(
                    'margin-right-105',
                    sort === 'practitioner' && 'sortActive',
                  )}
                  onClick={() => {
                    toggleWorkingCopySortSequence({
                      sort: 'practitioner',
                    });
                  }}
                >
                  Petitioner Counsel
                </span>
                {(sort === 'practitioner' && sortOrder === 'desc' && (
                  <FontAwesomeIcon icon="caret-up" />
                )) || <FontAwesomeIcon icon="caret-down" />}
              </th>
              <th>Respondent Counsel</th>
              <th colSpan="2">Trial Status</th>
            </tr>
          </thead>
          {sessions.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td>
                  <a href={`/case-detail/${item.docketNumber}`}>
                    {item.docketNumberWithSuffix}
                  </a>
                </td>
                <td>{item.caseName}</td>
                <td>
                  {item.practitioners.map((practitioner, idx) => (
                    <div key={idx}>{practitioner.name}</div>
                  ))}
                </td>
                <td>
                  {item.respondents.map((respondent, idx) => (
                    <div key={idx}>{respondent.name}</div>
                  ))}
                </td>
                <td>
                  <BindedSelect
                    bind={`trialSessionWorkingCopy[${item.docketNumber}].trialStatus`}
                    name="trialStatus"
                  >
                    <option value="">-Trial Status-</option>
                    {trialStatusOptions.map(({ key, value }) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </BindedSelect>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    );
  },
);
