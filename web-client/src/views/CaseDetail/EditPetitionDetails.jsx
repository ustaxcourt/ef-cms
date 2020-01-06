import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionDetails = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionFeePaymentSequence:
      sequences.updatePetitionFeePaymentSequence,
    validatePetitionFeePaymentSequence:
      sequences.validatePetitionFeePaymentSequence,
  },
  ({
    docketNumber,
    updateFormValueSequence,
    updatePetitionFeePaymentSequence,
    validatePetitionFeePaymentSequence,
  }) => {
    return (
      <>
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <h1>Edit Petition Details</h1>
          <div className="blue-container margin-bottom-4">
            <PetitionPaymentForm
              bind="form"
              dateBind="form"
              updateDateSequence={updateFormValueSequence}
              updateSequence={updateFormValueSequence}
              validateSequence={validatePetitionFeePaymentSequence}
              validationErrorsBind="validationErrors"
            />
          </div>

          <Button
            onClick={() => {
              updatePetitionFeePaymentSequence();
            }}
          >
            Save
          </Button>

          <Button link href={`/case-detail/${docketNumber}/case-information`}>
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
