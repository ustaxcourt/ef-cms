import { CreatePetitionerAccountForm } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountForm';
import { CreatePetitionerAccountInfo } from '@web-client/views/CreatePetitionerAccount/CreatePetitionerAccountInfo';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const CreatePetitionerAccount = connect({}, () => {
  return (
    <>
      <section className="usa-section">
        <div className="grid-container grid-gap-lg">
          <div className="grid-row">
            <div className="grid-col-12">
              <ErrorNotification />
              <WarningNotification />
            </div>
          </div>

          <div className="grid-row bg-white desktop:padding-x-5 padding-y-4 create-petitioner-account">
            <CreatePetitionerAccountForm />
            <CreatePetitionerAccountInfo />
          </div>
        </div>
      </section>
    </>
  );
});

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
