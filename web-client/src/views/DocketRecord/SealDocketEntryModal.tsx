import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SealDocketEntryModal = connect(
  {
    DOCKET_ENTRY_SEALED_TO_TYPES: state.constants.DOCKET_ENTRY_SEALED_TO_TYPES,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.sealDocketEntrySequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function SealDocketEntryModal({
    cancelSequence,
    confirmSequence,
    DOCKET_ENTRY_SEALED_TO_TYPES,
    modal,
    updateModalValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Seal"
        confirmSequence={confirmSequence}
        title="Seal Document"
      >
        <fieldset
          className="usa-fieldset margin-bottom-2"
          id="docket-entry-sealed-to-radios"
        >
          <legend htmlFor="docket-entry-sealed-to-radios">
            Who do you want to seal this to?
          </legend>
          <div className="usa-radio">
            <input
              aria-describedby="docket-entry-sealed-to-radios"
              checked={modal.docketEntrySealedTo === 'Public'}
              className="usa-radio__input"
              id="docketEntrySealedTo-public"
              name="docketEntrySealedTo"
              type="radio"
              value={DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="docketEntrySealedTo-public"
              id="docket-entry-sealed-to-public"
            >
              Seal to the public
            </label>
          </div>
          <div className="usa-radio">
            <input
              aria-describedby="docket-entry-sealed-to-radios"
              checked={modal.docketEntrySealedTo === 'External'}
              className="usa-radio__input"
              id="docketEntrySealedTo-external"
              name="docketEntrySealedTo"
              type="radio"
              value={DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL}
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="docketEntrySealedTo-external"
              id="docket-entry-sealed-to-external"
            >
              Seal to the public and parties of this case
            </label>
          </div>
        </fieldset>
      </ModalDialog>
    );
  },
);

SealDocketEntryModal.displayName = 'SealDocketEntryModal';
