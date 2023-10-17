import { CreatePetitionerAccountForm } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountForm';
import { connect } from '@cerebral/react';

import { CreatePetitionerAccountInfo } from '@web-client/views/Public/CreatePetitioneAccount/CreatePetitionerAccountInfo';
import React from 'react';

export const CreatePetitionerAccount = connect({}, () => {
  return (
    <>
      <div className="bg-white padding-y-3 padding-x-5 display-flex grid-gap-lg">
        <CreatePetitionerAccountForm></CreatePetitionerAccountForm>
        <CreatePetitionerAccountInfo></CreatePetitionerAccountInfo>
      </div>
    </>
  );
});

CreatePetitionerAccount.displayName = 'CreatePetitionerAccount';
