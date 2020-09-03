import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    canEditContactInformationSequence:
      sequences.canEditContactInformationSequence,
    user: state.user,
  },
  function MyContactInformation({ canEditContactInformationSequence, user }) {
    return (
      <>
        <div>
          <div className="card">
            <div className="content-wrapper gray">
              <h3>My Contact Information</h3>
              <hr />
              <AddressDisplay contact={{ ...user, ...user.contact }} />
              <p className="margin-bottom-0">
                <Button
                  link
                  icon="edit"
                  onClick={() => {
                    canEditContactInformationSequence();
                  }}
                >
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
