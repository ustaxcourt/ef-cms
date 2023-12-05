import { CreatePetitionerAccountForm } from '@web-client/views/Public/CreatePetitionerAccount/CreatePetitionerAccountForm';
import { CreatePetitionerAccountInfo } from '@web-client/views/Public/CreatePetitionerAccount/CreatePetitionerAccountInfo';
import { MessageAlert } from '@web-client/views/Public/MessageAlert/MessageAlert';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const CreatePetitionerAccount = connect(
  {
    alertError: state.alertError,
  },
  ({ alertError }) => {
    return (
      <>
        <div className="grid-container grid-gap-lg padding-x-4">
          {alertError && (
            <div
              className="grid-row margin-bottom-2"
              style={{ width: 'fit-content' }}
            >
              <MessageAlert
                alertType={alertError.alertType}
                message={alertError.message}
                title={alertError.title}
              ></MessageAlert>
            </div>
          )}
          <div className="grid-row bg-white padding-x-5 padding-y-4">
            <CreatePetitionerAccountForm />
            <CreatePetitionerAccountInfo />
          </div>
        </div>
      </>
    );
  },
);

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
