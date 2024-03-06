import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

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
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="download-docket-entries-modal"
        confirmLabel="Download"
        confirmSequence={confirmSequence}
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
              <input type="checkbox" />
              <span>Include printable docket record</span>
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

DownloadDocketEntriesModal.displayName = 'DownloadDocketEntriesModal';
