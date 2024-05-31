import { AppUpdatedModal } from './AppUpdatedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const GlobalModalWrapper = connect(
  {
    modal: state.modal,
  },
  function GlobalModalWrapper({ modal }) {
    console.log(modal.showModal);
    return <>{modal.showModal === 'AppUpdatedModal' && <AppUpdatedModal />}</>;
  },
);

GlobalModalWrapper.displayName = 'GlobalModalWrapper';
