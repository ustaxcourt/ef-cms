import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const OpenCases = connect(
  {
    openCases: state.formattedTrialSessionDetails.openCases,
  },
  function OpenCases({ openCases }) {
    return (
      <React.Fragment>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {openCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto overflow-y-hidden">
          <table
            aria-describedby="open-cases-tab"
            className="usa-table ustc-table trial-sessions subsection"
            id="open-cases"
          >
            <thead>
              <tr>
                <th
                  aria-label="Icons for consolidated and/or sealed cases"
                  className="consolidated-indicators"
                ></th>
                <th aria-label="Docket number">Docket No.</th>
                <th aria-label="Manually added indicator"></th>
                <th>Case Title</th>
                <th>Petitioner Counsel</th>
                <th>Respondent Counsel</th>
                <th>Calendar Notes</th>
                <th>{/* Empty header for minute sheet link column */}</th>
              </tr>
            </thead>
            {openCases.map(item => (
              <tbody key={item.docketNumber}>
                <tr className="eligible-cases-row">
                  <td>
                    <CaseIcons formattedCase={item} />
                  </td>
                  <td>
                    <span
                      className={classNames({
                        'margin-left-2': item.shouldIndent,
                      })}
                    >
                      <CaseLink formattedCase={item} />
                    </span>
                  </td>
                  <td>
                    {item.isManuallyAdded && (
                      <span aria-label="Manually added indicator">
                        <FontAwesomeIcon
                          className="mini-success"
                          icon="calendar-plus"
                          title="Manually added"
                        />
                      </span>
                    )}
                  </td>
                  <td>{item.caseTitle}</td>
                  <td>
                    {item.privatePractitioners.map(practitioner => (
                      <div key={practitioner.userId}>{practitioner.name}</div>
                    ))}
                  </td>
                  <td>
                    {item.irsPractitioners.map(respondent => (
                      <div key={respondent.userId}>{respondent.name}</div>
                    ))}
                  </td>
                  <td>
                    <PreformattedText text={item.calendarNotes} />
                  </td>
                  <td>
                    {item.displayMinuteSheetFormButton && (
                      <Button
                        data-testId={`minute-sheet-button-${item.docketNumber}`}
                        link
                        href={item.minuteSheetRoute}
                        icon="pencil-alt"
                      >
                        Minutes
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
        {openCases.length === 0 && <p>There are no open cases.</p>}
      </React.Fragment>
    );
  },
);

OpenCases.displayName = 'OpenCases';
