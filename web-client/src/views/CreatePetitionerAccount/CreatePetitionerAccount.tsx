import { CreatePetitionerAccountForm } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountForm';
import { CreatePetitionerAccountInfo } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountInfo';
import { MessageAlert } from '@web-client/ustc-ui/MessageAlert/MessageAlert';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CreatePetitionerAccount = connect(
  {
    alertError: state.alertError,
  },
  ({ alertError }) => {
    return (
      <>
        <div className="padding-y-5 padding-x-5 display-flex flex-justify-center">
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
            <div className="grid-row bg-white padding-x-5 padding-y-4 create-petitioner-account">
              <CreatePetitionerAccountForm />
              <CreatePetitionerAccountInfo />
            </div>
          </div>
        </div>
      </>
    );
  },
);

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
