import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SealDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.sealDocketEntrySequence, //todo: add this
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function SealDocketEntryModal({ cancelSequence, confirmSequence }) {
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
          id={'sealed-parties-radios-changeme'} // todo: changeme is probably not the best id
        >
          <legend htmlFor={'sealed-parties-radios-CHANGE-ME'}>
            Who do you want to seal this to?
          </legend>
          <div className="usa-radio">
            <input
              aria-describedby={'sealed-parties-radios-CHANGE-ME'}
              checked={true}
              className="usa-radio__input"
              id={'sealed-parties-public-CHANGE-ME'}
              name={'CHANGE-ME.sealedParty'}
              type="radio"
              value="Public"
              onChange={() => null} //todo: add onChange
            />
            <label
              className="usa-radio__label"
              htmlFor={'sealed-parties-public-CHANGE-ME'}
              id={'sealed-parties-public-label-CHANGE-ME'}
            >
              Seal to the public
            </label>
          </div>
          <div className="usa-radio">
            <input
              aria-describedby={'sealed-parties-radios-CHANGE-ME'}
              className="usa-radio__input"
              id={'sealed-parties-public-etall-CHANGE-ME'}
              name={'CHANGE-ME.sealed'}
              type="radio"
              value="Public-Etall" // todo: this is a weird name
              onChange={() => null} //todo: add onChange
            />
            <label
              className="usa-radio__label"
              htmlFor={'sealed-parties-public-etall-CHANGE-ME'}
              id={'sealed-parties-public-etall-label-CHANGE-ME'}
            >
              Seal to the public and parties of this case
            </label>
          </div>
        </fieldset>
      </ModalDialog>
    );
  },
);
