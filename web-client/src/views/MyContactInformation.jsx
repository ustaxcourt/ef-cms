import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    user: state.user,
  },
  ({ user }) => {
    return (
      <React.Fragment>
        <div className="case-search">
          <div className="card">
            <div className="content-wrapper gray">
              <h3>My Contact Information</h3>
              <hr />
              <p>
                {user.name} ({user.barNumber})
              </p>
              <p>
                {user.addressLine1}
                <br />
                {user.addressLine2}
              </p>
              <p>{user.phone}</p>
              <p className="margin-bottom-0">
                <a
                  className="usa-button usa-button--unstyled"
                  href="/user/address/edit"
                >
                  <FontAwesomeIcon className="margin-0" icon="edit" />
                  Edit
                </a>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
