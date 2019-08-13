import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const WorkingCopySessionList = connect(
  {
    sessions: state.trialSessionWorkingCopyHelper.formattedSessions,
    trialStatusOptions: state.trialSessionWorkingCopyHelper.trialStatusOptions,
  },
  ({ sessions, trialStatusOptions }) => {
    return (
      <div className="margin-top-4">
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number">
                <span className="padding-left-2px">Docket</span>
              </th>
              <th>Case Caption</th>
              <th>Petitioner Counsel</th>
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
