import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    user: state.user,
  },
  function MyContactInformation({ user }) {
    return (
      <>
        <div className="case-search">
          <div className="card">
            <div className="content-wrapper gray">
              <h3>My Contact Information</h3>
              <hr />
              <AddressDisplay contact={{ ...user, ...user.contact }} />
              <p className="margin-bottom-0">
                <Button link href="/user/contact/edit" icon="edit">
                  Edit
                </Button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  },
);
