import { Button } from '../../ustc-ui/Button/Button';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PenaltyInput = ({ index, value }) => {
  const oneBaseIndex = index + 1;
  return (
    <div className="margin-top-3">
      <label className="usa-label" htmlFor={`penalty_${oneBaseIndex}`}>
        Penalty {oneBaseIndex} (IRS)
      </label>
      <input
        className="usa-input"
        defaultValue={value}
        id={`penalty_${oneBaseIndex}`}
        name={`penalty_${oneBaseIndex}`}
      />
    </div>
  );
};

export const CalculatePenaltiesModal = connect(
  {
    addPenaltyInputSequence: sequences.addPenaltyInputSequence,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    penalties: state.modal.penalties,
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
