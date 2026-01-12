import { Button } from '@web-client/dawson-ui/ui/button';
import React from 'react';

export const EditRemoteStatusButton = ({
  openEditRemoteStatusModalSequence,
  showEditRemoteTrialPermission,
}: {
  openEditRemoteStatusModalSequence: Function;
  showEditRemoteTrialPermission: boolean;
}) => {
  return (
    <>
      {showEditRemoteTrialPermission && (
        <div className="margin-bottom-1">
          <Button
            className="padding-0"
            variant="primaryTertiary"
            data-testid="edit-remote-status"
            icon="edit"
            id="edit-remote-status-button"
            onClick={() => {
              openEditRemoteStatusModalSequence();
            }}
          >
            Edit Remote Status
          </Button>
        </div>
      )}
    </>
  );
};
EditRemoteStatusButton.displayName = 'EditRemoteStatusButton';
