import { AddressDisplay } from './CaseDetail/PartyInformation';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    constants: state.constants,
    user: state.user,
  },
  ({ constants, user }) => {
    return (
      <>
        <div className="case-search">
          <div className="card">
            <div className="content-wrapper gray">
              <h3>My Contact Information</h3>
              <hr />
              {AddressDisplay({ ...user, ...user.contact }, constants)}
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
