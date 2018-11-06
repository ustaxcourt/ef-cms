import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';

/**
 * Footer
 */
export default connect(
  {
    caseList: state.cases,
  },
  function CaseList({ caseList }) {
    return (
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Docket number</th>
            <th>Date submitted</th>
            <th>Petitioner name</th>
            <th>Fee status</th>
          </tr>
        </thead>
        <tbody>
          {caseList.map(item => (
            <tr key={item.docketNumber}>
              <td className="responsive-title">
                <span className="responsive-label">Docket number</span>
                <a href={'/case-detail/' + item.docketNumber}>
                  {item.docketNumber}
                </a>
              </td>
              <td>
                <span className="responsive-label">Date submitted</span>
                {item.dateSubmitted}
              </td>
              <td>
                <span className="responsive-label">Petitioner name</span>
                {item.petitionerName}
              </td>
              <td>
                <span className="responsive-label">Fee status</span>
                {item.feeStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);
