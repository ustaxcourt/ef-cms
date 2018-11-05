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
            <th>Docket Number</th>
            <th>Date submitted</th>
            <th>Petitioner Name</th>
            <th>Fee Status</th>
          </tr>
        </thead>
        <tbody>
          {caseList.map(item => (
            <tr key={item.docketNumber}>
              <td>
                <span className="responsive-label">Docket Number</span>
                <span className="docket-detail">
                  <a href={'/case-detail/' + item.docketNumber}>
                    {item.docketNumber}
                  </a>
                </span>
              </td>
              <td>{item.dateSubmitted}</td>
              <td>{item.petitionerName}</td>
              <td>{item.feeStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);
