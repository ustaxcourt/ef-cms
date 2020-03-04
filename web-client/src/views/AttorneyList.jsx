import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const AttorneyList = connect(
  {
    attorneyListHelper: state.attorneyListHelper,
  },
  ({ attorneyListHelper }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Attorney List</h1>
          </div>
        </div>

        <section className="grid-container">
          <Button
            className="margin-bottom-4 margin-right-0 float-right"
            href={'/users/create-attorney'}
          >
            Create New Attorney User
          </Button>

          <table
            className="usa-table ustc-table trial-sessions subsection"
            id="all-attorney-users"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Bar number</th>
              </tr>
            </thead>
            {attorneyListHelper.attorneyUsers.map((item, idx) => (
              <tbody key={idx}>
                <tr className="attorney-user-row">
                  <td>{item.name}</td>
                  <td>
                    <Button link href={`/users/edit-attorney/${item.userId}`}>
                      {item.barNumber}
                    </Button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </section>
      </>
    );
  },
);
