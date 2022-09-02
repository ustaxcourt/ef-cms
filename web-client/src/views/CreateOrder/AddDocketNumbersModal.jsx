import { ConsolidatedCasesCheckboxes } from '../ConfirmInitiateServiceModal';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketNumbersModal = connect(
  {
    addDocketNumbersModalHelper: state.addDocketNumbersModalHelper,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitUpdateAddDocketNumbersToOrderSequence,
    consolidatedCaseAllCheckbox: state.consolidatedCaseAllCheckbox,
    consolidatedCaseCheckboxAllChange:
      sequences.consolidatedCaseCheckboxAllChangeSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    updateCaseCheckbox: sequences.updateCaseCheckboxSequence,
  },
  function AddDocketNumbersModal({
    addDocketNumbersModalHelper,
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
        confirmLabel={addDocketNumbersModalHelper.confirmLabelTitle}
        confirmSequence={confirmSequence}
        title={addDocketNumbersModalHelper.modalTitle}
      >
        <div className="ustc-create-order-modal">
          <p>
            Select cases that you want to add to the header of the cover sheet.
            <br />
            {addDocketNumbersModalHelper.modalText}
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
