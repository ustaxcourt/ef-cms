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
    documentsSelectedForDownload: state.documentsSelectedForDownload,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function DownloadDocketEntriesModal({
    cancelSequence,
    confirmSequence,
    documentsSelectedForDownload,
    updateModalValueSequence,
  }) {
    const [isAddPrintableDocketRecordSelected, selectPrintableDocketRecord] =
      useState(false);
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="download-docket-entries-modal"
        confirmLabel="Download"
        confirmSequence={() =>
          confirmSequence({ isAddPrintableDocketRecordSelected })
        }
        title="Download Docket Entries"
      >
        <div className="margin-bottom-4">
          <FormGroup>
            <fieldset className="usa-fieldset margin-bottom-0">
              <p className="display-block" id="trial-term">
                {`You have ${documentsSelectedForDownload.length} docket entries
                to download as a zip file.`}
              </p>
              <p className="display-block" id="trial-term">
                Do you want to include the printable docket record?
              </p>
              <input
                checked={isAddPrintableDocketRecordSelected}
                type="checkbox"
                onChange={() =>
                  selectPrintableDocketRecord(
                    !isAddPrintableDocketRecordSelected,
                  )
                }
              />
              <span>Include printable docket record</span>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

DownloadDocketEntriesModal.displayName = 'DownloadDocketEntriesModal';
