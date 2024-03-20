import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const DownloadDocketEntriesModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.batchDownloadDocketEntriesSequence,
    docketRecordHelper: state.docketRecordHelper,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function DownloadDocketEntriesModal({
    cancelSequence,
    confirmSequence,
    docketRecordHelper,
  }) {
    const [isAddPrintableDocketRecordSelected, selectPrintableDocketRecord] =
      useState(false);
    const numDocketEntries = docketRecordHelper.countOfDocumentsForDownload;
    const docketEntriesText = `${numDocketEntries} ${numDocketEntries === 1 ? 'docket entry' : 'docket entries'}`;
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="download-docket-entries-modal"
        confirmLabel="Download"
        confirmSequence={() =>
          confirmSequence({ isAddPrintableDocketRecordSelected })
        }
        dataTestId="download-docket-entries-modal"
        title="Download Docket Entries"
      >
        <div className="margin-bottom-4">
          <FormGroup>
            <fieldset className="usa-fieldset margin-bottom-0">
              <p
                className="display-block"
                data-testid="documents-download-count-text"
                id="documents-download-count-text"
              >
                {`You have selected ${docketEntriesText} to download as a zip file.`}
              </p>
              <p className="display-block" id="trial-term">
                Do you want to include the printable docket record?
              </p>
              <div className="usa-checkbox">
                <input
                  checked={isAddPrintableDocketRecordSelected}
                  className="usa-checkbox__input"
                  id="include-printable-docket-record-checkbox"
                  type="checkbox"
                  onChange={() =>
                    selectPrintableDocketRecord(
                      !isAddPrintableDocketRecordSelected,
                    )
                  }
                />
                <label
                  className="usa-checkbox__label"
                  data-testid="include-printable-docket-record-checkbox-checkbox-label"
                  htmlFor="include-printable-docket-record-checkbox"
                  id="include-printable-docket-record-checkbox-checkbox-label"
                >
                  Include printable docket record
                </label>
              </div>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

DownloadDocketEntriesModal.displayName = 'DownloadDocketEntriesModal';
