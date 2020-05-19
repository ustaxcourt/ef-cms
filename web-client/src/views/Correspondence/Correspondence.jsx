import { CorrespondenceHeader } from './CorrespondenceHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const Correspondence = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    showModal: state.modal.showModal,
  },
  function Correspondence({ formattedCaseDetail }) {
    return (
      <>
        <CorrespondenceHeader />
        <table
          aria-label="docket record"
          className="usa-table case-detail docket-record responsive-table row-border-only"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Correspondence Description</th>
              <th>Created By</th>
              <th aria-hidden="true" className="icon-column" />
              <th aria-hidden="true" className="icon-column" />
            </tr>
          </thead>
          <tbody>
            {formattedCaseDetail.formattedDocketEntries.map(entry => {
              return (
                <tr
                  className={classNames(
                    entry.showInProgress && 'in-progress',
                    entry.showQcUntouched && 'qc-untouched',
                  )}
                  key={entry.index}
                >
                  <td>
                    <span className="no-wrap">{entry.createdAtFormatted}</span>
                  </td>
                  <td className="center-column hide-on-mobile">
                    {entry.eventCode}
                  </td>
                  <td>{entry.index}</td>

                  <td
                    aria-hidden="true"
                    className="filing-type-icon hide-on-mobile"
                  >
                    {entry.isPaper && (
                      <FontAwesomeIcon icon={['fas', 'file-alt']} />
                    )}

                    {entry.showInProgress && (
                      <FontAwesomeIcon icon={['fas', 'thumbtack']} />
                    )}

                    {entry.showQcUntouched && (
                      <FontAwesomeIcon icon={['fa', 'star']} />
                    )}

                    {entry.showLoadingIcon && (
                      <FontAwesomeIcon
                        className="fa-spin spinner"
                        icon="spinner"
                      />
                    )}
                  </td>
                  <td className="hide-on-mobile">{entry.filedBy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
);
