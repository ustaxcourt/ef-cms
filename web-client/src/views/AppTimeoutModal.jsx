import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

class CreateMessageModalDialogComponent extends ModalDialog {}
