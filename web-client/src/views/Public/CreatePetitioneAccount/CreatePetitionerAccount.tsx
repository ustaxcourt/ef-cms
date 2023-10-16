import { CreatePetitionerAccountForm } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountForm';
import { connect } from '@cerebral/react';

import { CreatePetitionerAccountInfo } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountInfo';
import React from 'react';

export const CreatePetitionerAccount = connect({}, () => {
  return (
    <>
      <div className="petitioner-account-creation-form">
        <div className="grid-container padding-top-5 padding-bottom-5">
          <div className="grid-row flex-justify-center bg-white border border-base-lighter">
            <CreatePetitionerAccountForm></CreatePetitionerAccountForm>
            <CreatePetitionerAccountInfo></CreatePetitionerAccountInfo>
          </div>
        </div>
      </div>
    </>
  );
});

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
