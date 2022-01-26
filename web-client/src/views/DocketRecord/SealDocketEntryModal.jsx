import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SealDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.sealDocketEntrySequence,
    form: state.form,
    //todo: add this
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function SealDocketEntryModal({ cancelSequence, confirmSequence, form }) {
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
          id="docket-entry-sealed-parties-radios"
        >
          <legend htmlFor="docket-entry-sealed-parties-radios">
            Who do you want to seal this to?
          </legend>
          <div className="usa-radio">
            <input
              aria-describedby="docket-entry-sealed-parties-radios"
              checked={form.sealedParties === 'public'}
              className="usa-radio__input"
              id="docketEntrySealedParties-public"
              name="docketEntrySealedParties"
              type="radio"
              value="Public"
              onChange={() => null} //todo: add onChange
            />
            <label
              className="usa-radio__label"
              htmlFor="docketEntrySealedParties-public"
              id="docket-entry-sealed-parties-public"
            >
              Seal to the public
            </label>
          </div>
          <div className="usa-radio">
            <input
              aria-describedby="docket-entry-sealed-parties-radios"
              checked={form.sealedParties === 'all'}
              className="usa-radio__input"
              id="docketEntrySealedParties-all"
              name="docketEntrySealedParties"
              type="radio"
              value="All" // todo: this is a weird name
              onChange={() => null} //todo: add onChange
            />
            <label
              className="usa-radio__label"
              htmlFor="docketEntrySealedParties-public"
              id="docket-entry-sealed-parties-all"
            >
              Seal to the public and parties of this case
            </label>
          </div>
        </fieldset>
      </ModalDialog>
    );
  },
);
