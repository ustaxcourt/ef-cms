import { ModalDialog } from './ModalDialog';
import { TroubleshootingLinkInfo } from '@web-client/presenter/sequences/showFileUploadErrorModalSequence';
import { connect } from '@web-client/presenter/shared.cerebral';
import { isEmpty } from 'lodash';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileUploadErrorModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    contactSupportMessage: state.modal.contactSupportMessage,
    message: state.modal.message,
    modalTitle: state.modal.title,
    troubleshootingLink: state.modal.troubleshootingLink,
  },
  function FileUploadErrorModal({
    clearModalSequence,
    contactSupportMessage,
    message,
    modalTitle,
    troubleshootingLink,
  }: {
    clearModalSequence: any;
    contactSupportMessage: string;
    message: string;
    modalTitle: string;
    troubleshootingLink: TroubleshootingLinkInfo;
  }) {
    return (
      <ModalDialog
        cancelSequence={clearModalSequence}
        confirmLabel="Close"
        confirmSequence={clearModalSequence}
        dataTestId="file-upload-error-modal"
        title={modalTitle || 'An error occurred'}
      >
        {message || 'There is a problem with your submission. Try again later.'}
        {!isEmpty(troubleshootingLink) && (
          <React.Fragment>
            <br />
            <br />
            <a className="usa-link--external" href={troubleshootingLink.link}>
              {troubleshootingLink.message}
            </a>
          </React.Fragment>
        )}
        <br />
        <br />
        {(contactSupportMessage ||
          'If you still have a problem after trying again, email') + ' '}
        <a href="mailto:dawson.support@ustaxcourt.gov">
          dawson.support@ustaxcourt.gov
        </a>
        .
      </ModalDialog>
    );
  },
);

FileUploadErrorModal.displayName = 'FileUploadErrorModal';
