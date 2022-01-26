import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SealDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.sealDocketEntrySequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function SealDocketEntryModal({
    cancelSequence,
    confirmSequence,
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
              value="Public"
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: 'Public',
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
              value="External" // TODO: make this a constant
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: 'External',
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
