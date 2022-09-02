import { ConsolidatedCasesCheckboxes } from '../ConfirmInitiateServiceModal';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketNumbersModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitEditOrderTitleModalSequence,
    consolidatedCaseAllCheckbox: state.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
  },
  function AddDocketNumbersModal({
    cancelSequence,
    confirmSequence,
    consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange,
    formattedCaseDetail,
    updateCaseCheckbox,
  }) {
    return (
      <ModalDialog
        cancelLabel="Take Me Back"
        cancelLink={false}
        cancelSequence={cancelSequence}
        confirmLabel="Add Docket Numbers"
        confirmSequence={confirmSequence}
        title="Add Docket Numbers"
      >
        <div className="ustc-create-order-modal">
          <p>
            Select cases that you want to add to the header of the cover sheet.
            <br />
            Petitioner&apos;s name will be automatically appended with &quot;ET
            AL.&quot;.
          </p>

          <ConsolidatedCasesCheckboxes
            consolidatedCaseAllCheckbox={consolidatedCaseAllCheckbox}
            consolidatedCaseCheckboxAllChange={
              consolidatedCaseCheckboxAllChange
            }
            formattedCaseDetail={formattedCaseDetail}
            updateCaseCheckbox={updateCaseCheckbox}
          />
        </div>
      </ModalDialog>
    );
  },
);
