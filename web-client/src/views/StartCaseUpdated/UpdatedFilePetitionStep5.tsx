import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep5 = connect(
  {
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
  },
  function UpdatedFilePetitionStep5({
    updatedFilePetitionGoBackAStepSequence,
  }) {
    return (
      <>
        <p>John is Testing</p>
        <div>
          <Button
            onClick={() => {
              console.log('updatedFilePetitionCompleteStep5Sequence');
            }}
          >
            Next
          </Button>
          <Button
            secondary
            onClick={() => {
              updatedFilePetitionGoBackAStepSequence();
            }}
          >
            Back
          </Button>
          <Button link onClick={() => console.log('Cancel')}>
            Cancel
          </Button>
        </div>
      </>
    );
  },
);
