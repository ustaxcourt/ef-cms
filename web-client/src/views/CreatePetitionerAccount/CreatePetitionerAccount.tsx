import { AccountAlreadyExistsWarning } from '@web-client/views/CreatePetitionerAccount/AccountAlreadyExistsWarning';
import { CreatePetitionerAccountForm } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountForm';
import { CreatePetitionerAccountInfo } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountInfo';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const CreatePetitionerAccount = connect({}, () => {
  return (
    <>
      <section className="usa-section">
        <div className="grid-container padding-y-5">
          <div className="grid-row">
            <div className="grid-col-12">
              <ErrorNotification />
              <AccountAlreadyExistsWarning />
            </div>
          </div>

          <div className="grid-row bg-white padding-x-5 padding-y-4">
            <CreatePetitionerAccountForm />
            <CreatePetitionerAccountInfo />
          </div>
        </div>
      </section>
    </>
  );
});

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
