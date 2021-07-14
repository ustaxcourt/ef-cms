import { ArchiveDraftDocumentModal } from './ArchiveDraftDocumentModal';
import { ConfirmEditModal } from './ConfirmEditModal';
import { ConfirmRemoveSignatureModal } from '../Messages/ConfirmRemoveSignatureModal';
import { DraftDocumentViewer } from '../DocketRecord/DraftDocumentViewer';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DraftDocuments = connect(
  {
    formattedDocketEntries: state.formattedDocketEntries,
    showModal: state.modal.showModal,
    stipulatedDecisionEventCode: state.constants.STIPULATED_DECISION_EVENT_CODE,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocuments({
    formattedDocketEntries,
    showModal,
    stipulatedDecisionEventCode,
    viewerDraftDocumentToDisplay,
  }) {
    return (
      <>
        {formattedDocketEntries.formattedDraftDocuments.length === 0 && (
          <p>There are no draft documents.</p>
        )}
        {formattedDocketEntries.formattedDraftDocuments.length > 0 && (
          <DraftDocumentViewer />
        )}
        {showModal === 'ArchiveDraftDocumentModal' &&
          viewerDraftDocumentToDisplay.eventCode ===
            stipulatedDecisionEventCode && (
            <ArchiveDraftDocumentModal
              message="Return to the Proposed Stipulated Decision to re-sign."
              showDocumentTitle={false}
              title="Are You Sure You Want to Delete the Stipulated Decision?"
            />
          )}
        {showModal === 'ArchiveDraftDocumentModal' &&
          viewerDraftDocumentToDisplay.eventCode !==
            stipulatedDecisionEventCode && <ArchiveDraftDocumentModal />}
        {showModal === 'ConfirmEditModal' && (
          <ConfirmEditModal confirmSequence="navigateToEditOrderSequence" />
        )}
        {showModal === 'ConfirmRemoveSignatureModal' && (
          <ConfirmRemoveSignatureModal confirmSequence="removeSignatureSequence" />
        )}
      </>
    );
  },
);
