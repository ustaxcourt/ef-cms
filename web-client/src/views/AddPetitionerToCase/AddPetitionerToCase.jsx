import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const AddPetitionerToCase = connect({}, function AddPetitionerToCase() {
  return (
    <>
      <CaseDetailHeader />

      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <h1>Add Petitioner</h1>
      </section>
    </>
  );
});
