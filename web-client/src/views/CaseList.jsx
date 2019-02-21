import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import moment from 'moment';
import React from 'react';

/**
 * Case List
 */
export default connect(
  {
    caseList: state.formattedCases,
  },
  function CaseList({ caseList }) {
    return (
      <table className="responsive-table work-queue" id="case-list">
        <thead>
          <tr>
            <th>Docket number</th>
            <th>Date filed</th>
            <th>Petitioner name</th>
          </tr>
        </thead>
        <tbody>
          {caseList.map(item => (
            <tr key={item.docketNumber}>
              <td className="responsive-title">
                <span className="responsive-label">Docket number</span>
                <a href={'/case-detail/' + item.docketNumber}>
                  {item.docketNumberWithSuffix}
                </a>
              </td>
              <td>
                <span className="responsive-label">Date filed</span>
                {moment(item.createdAt).format('LLL')}
              </td>
              <td>
                <span className="responsive-label">Petitioner name</span>
                {item.petitionerName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);
