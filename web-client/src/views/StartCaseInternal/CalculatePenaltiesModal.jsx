import { Button } from '../../ustc-ui/Button/Button';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CalculatePenaltiesModal = connect(
  {
    addPenaltyInputSequence: sequences.addPenaltyInputSequence,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.calculatePenaltiesSequence,
    penalties: state.modal.penalties,
    statisticsFormHelper: state.statisticsFormHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function CalculatePenaltiesModal({
    addPenaltyInputSequence,
    cancelSequence,
    confirmSequence,
    penalties,
    statisticsFormHelper,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Calculate"
        confirmSequence={confirmSequence}
        title="Calculate Penalties on IRS Notice"
      >
        {penalties &&
          penalties.map((penalty, index) => (
            <div className="margin-top-3" key={index}>
              <label className="usa-label" htmlFor={`penalty_${index}`}>
                Penalty {index + 1} (IRS)
              </label>
              <DollarsInput
                className="usa-input"
                id={`penalty_${index}`}
                name={`penalties.${index}`}
                value={penalties[index]}
                onValueChange={values => {
                  updateModalValueSequence({
                    key: `penalties.${index}`,
                    value: values.value,
                  });
                }}
              />
            </div>
          ))}
        {statisticsFormHelper.showAddAnotherPenaltyButton && (
          <Button
            link
            className="margin-top-2 add-another-penalty-button"
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
