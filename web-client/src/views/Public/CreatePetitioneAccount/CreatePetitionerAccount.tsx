import { CreatePetitionerAccountForm } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountForm';
import { connect } from '@cerebral/react';

import { CreatePetitionerAccountInfo } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountInfo';
import React from 'react';

export const CreatePetitionerAccount = connect({}, () => {
  return (
    <div className="bg-white padding-y-4 grid-container grid-gap-lg padding-x-4">
      <div className="grid-row">
        <CreatePetitionerAccountForm></CreatePetitionerAccountForm>
        <CreatePetitionerAccountInfo></CreatePetitionerAccountInfo>
      </div>
    </div>
  );
});

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
