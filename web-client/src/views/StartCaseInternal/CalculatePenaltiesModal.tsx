import { Button } from '../../ustc-ui/Button/Button';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CalculatePenaltiesModal = connect(
  {
    addPenaltyInputSequence: sequences.addPenaltyInputSequence,
    cancelSequence: sequences.clearModalSequence,
    checkForNegativeValueSequence: sequences.checkForNegativeValueSequence,
    confirmSequence: sequences.calculatePenaltiesSequence,
    confirmationText: state.confirmationText,
    errors: state.modal.error,
    penalties: state.modal.penalties,
    penaltyNameLabel: state.modal.penaltyNameLabel,
    showAddAnotherPenaltyButton:
      state.statisticsFormHelper.showAddAnotherPenaltyButton,
    title: state.modal.title,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function CalculatePenaltiesModal({
    addPenaltyInputSequence,
    cancelSequence,
    checkForNegativeValueSequence,
    confirmationText,
    confirmSequence,
    errors,
    penalties,
    penaltyNameLabel,
    showAddAnotherPenaltyButton,
    title,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Calculate and Save"
        confirmSequence={confirmSequence}
        title={title}
      >
        {errors &&
          Object.keys(errors).map(key => {
            return (
              <div key={errors[key]}>
                <span className="usa-error-message">{errors[key]}</span>
              </div>
            );
          })}
        {penalties &&
          penalties.map((penalty, index) => (
            <FormGroup
              className="margin-top-3"
              confirmationText={
                confirmationText?.penalties[index]?.penaltyAmount
              }
              key={penalty.name}
            >
              <label className="usa-label" htmlFor={`penalty_${index}`}>
                Penalty {index + 1} {penaltyNameLabel}
              </label>
              <DollarsInput
                className="usa-input"
                id={`penalty_${index}`}
                name={`penalties.${index}`}
                value={penalties[index].penaltyAmount}
                onValueChange={values => {
                  updateModalValueSequence({
                    key: `penalties.${index}.penaltyAmount`,
                    value: values.value,
                  });
                  checkForNegativeValueSequence({
                    key: `penalties.${index}.penaltyAmount`,
                    value: values.value,
                  });
                }}
              />
            </FormGroup>
          ))}
        {showAddAnotherPenaltyButton && (
          <Button
            link
            className="margin-top-2 modal-button-link"
            icon="plus-circle"
            onClick={() => addPenaltyInputSequence()}
          >
            Add another penalty
          </Button>
        )}
      </ModalDialog>
    );
  },
);

CalculatePenaltiesModal.displayName = 'CalculatePenaltiesModal';
