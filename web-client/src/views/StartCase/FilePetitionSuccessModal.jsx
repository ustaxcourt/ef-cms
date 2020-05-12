import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FilePetitionSuccessModal = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
  },
  function FilePetitionSuccessModal({ docketNumber }) {
    return (
      <>
        <ConfirmModal
          noCancel
          className="file-petition-success-modal"
          confirmLabel="Ok"
          displaySuccessBanner={true}
          headerIcon="check-circle"
          headerIconClassName="success-icon"
          title="Your case has been successfully submitted."
          onCancelSequence="clearModalSequence"
          onConfirmSequence="clearModalSequence"
        >
          <p>Your case has been assigned Docket Number {docketNumber}.</p>

          <p>
            Once your Petition is processed by the Court, you’ll be able to see
            and print a confirmation page under the Case Information tab in your
            case. You’ll also be able to check the status of your case, submit
            new documents, and view activity on the case on the docket record.
          </p>
          <strong>Next steps</strong>

          <ul className="usa-list steps-after-filing">
            <li>
              You’ll need to pay a filing fee or submit a waiver. You can view
              all the options for this on your “My Cases“ page.
            </li>
            <li>
              As new info about the case becomes available you will be notified.
            </li>
          </ul>
        </ConfirmModal>
      </>
    );
  },
);
