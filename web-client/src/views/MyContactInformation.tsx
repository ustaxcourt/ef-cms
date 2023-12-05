import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const MyContactInformation = connect(
  {
    canEditContactInformationSequence:
      sequences.canEditContactInformationSequence,
    user: state.user,
  },
  function MyContactInformation({ canEditContactInformationSequence, user }) {
    return (
      <div className="card">
        <div className="content-wrapper gray">
          <h3>My Contact Information</h3>
          <hr />
          <AddressDisplay contact={{ ...user, ...user.contact }} />
          <p className="margin-bottom-0">
            <Button
              link
              className="text-left"
              data-testid="edit-contact-info"
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
    );
  },
);

MyContactInformation.displayName = 'MyContactInformation';
