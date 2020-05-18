import { Button } from '../../ustc-ui/Button/Button';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PenaltyInput = ({ index, value }) => {
  return (
    <div className="margin-top-3">
      <label className="usa-label" htmlFor={`penalty_${index}`}>
        Penalty {index} (IRS)
      </label>
      <input
        className="usa-input"
        id={`penalty_${index}`}
        initialValue={value}
        name={`penalty_${index}`}
      />
    </div>
  );
};

export const CalculatePenaltiesModal = connect(
  {
    addPenaltyInputSequence: sequences.addPenaltyInputSequence,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    penalties: state.modal.meta.penalties,
  },
  function CalculatePenaltiesModal({
    addPenaltyInputSequence,
    cancelSequence,
    confirmSequence,
    penalties,
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
          penalties.map((penalty, idx) => (
            <PenaltyInput index={idx} key={idx} value={penalty} />
          ))}
        <Button
          link
          className="margin-top-2"
          icon="plus-circle"
          onClick={() => addPenaltyInputSequence()}
        >
          Add More Penalties
        </Button>
      </ModalDialog>
    );
  },
);
