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
        <h1 tabIndex="-1">Petitions Secton Work Queue</h1>
        <SuccessNotification />
        <ErrorNotification />
        <h2>Cases</h2>
        <table className="responsive-table">
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
