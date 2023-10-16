import { connect } from '@cerebral/react';

import React from 'react';

export const CreatePetitionerAccountInfo = connect({}, () => {
  return (
    <>
      <div
        className="
              grgrid-col-auto
              mobile-lg:grid-col-10
              tablet:grid-col-8
              desktop:grid-col-6
              padding-x-205
            "
      >
        TEST TEXT HERE
      </div>
    </>
  );
});

CreatePetitionerAccountInfo.displayName = 'CreatePetitioneAccountForm';
