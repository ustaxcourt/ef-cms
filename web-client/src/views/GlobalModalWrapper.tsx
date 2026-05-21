import { AppUpdatedModal } from './AppUpdatedModal';
import { ReadOnlyModeEngagedModal } from './Maintenance/ReadOnlyModeEngagedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const GlobalModalWrapper = connect(
  {
    modal: state.modal,
  },
  function GlobalModalWrapper({ modal }) {
    return (
      <>
        {modal.showModal === 'AppUpdatedModal' && <AppUpdatedModal />}
        {modal.showModal === 'ReadOnlyModeEngagedModal' && (
          <ReadOnlyModeEngagedModal />
        )}
      </>
    );
  },
);

GlobalModalWrapper.displayName = 'GlobalModalWrapper';
