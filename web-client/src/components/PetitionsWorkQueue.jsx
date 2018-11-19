import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';
import moment from 'moment';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  { caseList: state.cases },
  function Dashboard({ caseList }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Petitions section work queue</h1>
        <SuccessNotification />
        <ErrorNotification />
        <h2>Cases</h2>
        <table className="responsive-table" id="workQueue">
          <thead>
            <tr>
              <th>Docket number</th>
              <th>Date filed</th>
              <th>Petitioner name</th>
              <th>Assigned to</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {!caseList.length && (
              <tr>
                <td colSpan="5">(none)</td>
              </tr>
            )}
            {caseList.map(item => (
              <tr key={item.docketNumber}>
                <td className="responsive-title">
                  <span className="responsive-label">Docket number</span>
                  <a href={'/case-detail/' + item.caseId}>
                    {item.docketNumber}
                  </a>
                </td>
                <td>
                  <span className="responsive-label">Date filed</span>
                  {moment(item.createdAt).format('LLL')}
                </td>
                <td>
                  <span className="responsive-label">Petitioner name</span>
                  {item.userId}
                </td>
                <td>Unassigned</td>
                <td>New petition ready for review</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
