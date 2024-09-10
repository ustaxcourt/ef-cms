import { ModalDialog } from './ModalDialog';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
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
        title={modalTitle || 'There Is a Problem with This Submission'}
      >
        {message ||
          'There is a problem with the submission. Your firewall or network may be preventing the submission. Check your firewall or network setting and try again.'}
        {!isEmpty(troubleshootingLink) && (
          <React.Fragment>
            <br />
            <br />
            <a
              className="usa-link--external"
              href={troubleshootingLink.link}
              rel="noreferrer"
              target="_blank"
            >
              {troubleshootingLink.message}
            </a>
          </React.Fragment>
        )}
        <br />
        <br />
        {(contactSupportMessage ||
          'If you still have a problem after trying again, email') + ' '}
        <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
          {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
        </a>
        .
      </ModalDialog>
    );
  },
);

FileUploadErrorModal.displayName = 'FileUploadErrorModal';
