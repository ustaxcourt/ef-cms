import { Button } from '../../ustc-ui/Button/Button';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const CalculatePenaltiesModal = connect(
  {
    addPenaltyInputSequence: sequences.addPenaltyInputSequence,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.calculatePenaltiesSequence,
    confirmSequenceOverride: props.confirmSequenceOverride,
    penalties: state.modal.penalties,
    statisticsFormHelper: state.statisticsFormHelper,
    title: state.modal.title,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function CalculatePenaltiesModal({
    addPenaltyInputSequence,
    cancelSequence,
    confirmSequence,
    confirmSequenceOverride,
    penalties,
    statisticsFormHelper,
    title,
    updateModalValueSequence,
  }) {
    console.log('override', confirmSequenceOverride);
    console.log('confirm', confirmSequence);
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Calculate and Save"
        confirmSequence={() => {
          confirmSequenceOverride
            ? confirmSequenceOverride()
            : confirmSequence();
        }}
        title={title}
      >
        {penalties &&
          penalties.map((penalty, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="margin-top-3" key={index}>
              <label className="usa-label" htmlFor={`penalty_${index}`}>
                Penalty {index + 1} (IRS)
              </label>
              <DollarsInput
                className="usa-input"
                id={`penalty_${index}`}
                name={`penalties.${index}`}
                value={penalties[index].irsPenaltyAmount}
                onValueChange={values => {
                  updateModalValueSequence({
                    key: `penalties.${index}.irsPenaltyAmount`,
                    value: values.value,
                  });
                }}
              />
            </div>
          ))}
        {statisticsFormHelper.showAddAnotherPenaltyButton && (
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
