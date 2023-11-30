import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const SpousePermissionConfirmModal = connect(
  {},
  function SpousePermissionConfirmModal() {
    return (
      <ConfirmModal
        noCancel
        confirmLabel="OK"
        preventCancelOnBlur={true}
        title="You Must Have Your Spouse’s Consent to File on Their Behalf"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="clearModalSequence"
      >
        <p>
          To file on behalf of your spouse, you must have consent. Both you and
          your spouse should sign the Petition.
        </p>
        <p>
          If you do not have your spouse’s consent, select “Myself” as the
          person who is filing.
        </p>
      </ConfirmModal>
    );
  },
);

SpousePermissionConfirmModal.displayName = 'SpousePermissionConfirmModal';
