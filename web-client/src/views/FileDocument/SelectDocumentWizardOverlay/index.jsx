import { Tab, Tabs } from '../../../ustc-ui/Tabs/Tabs';
import { ViewAllDocumentsMobile } from './ViewAllDocumentsMobile';
import { ViewDocumentCategory } from './ViewDocumentCategory';
import { WhatDocumentIsThis } from './WhatDocumentIsThis';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import FocusLock from 'react-focus-lock';
import React from 'react';
import ReactDOM from 'react-dom';

const appRoot = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');

class SelectDocumentWizardOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  toggleNoScroll(scrollingOn) {
    if (scrollingOn) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', this.touchmoveTriggered, {
        passive: false,
      });
    }
  }

  keydownTriggered(event) {
    if (event.keyCode === 27) {
      return this.blurDialog(event);
    }
  }
  touchmoveTriggered(event) {
    return event.preventDefault();
  }
  blurDialog(event) {
    return this.runCancelSequence(event);
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
    appRoot.inert = true;
    appRoot.setAttribute('aria-hidden', 'true');
    document.addEventListener('keydown', this.keydownTriggered, false);
    this.toggleNoScroll(true);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    appRoot.inert = false;
    appRoot.setAttribute('aria-hidden', 'false');
    document.removeEventListener('keydown', this.keydownTriggered, false);

    this.toggleNoScroll(false);
  }

  render() {
    return ReactDOM.createPortal(this.renderModalContent(), this.el);
  }

  renderModalContent() {
    return (
      <FocusLock>
        <dialog open className="modal-screen overlay-full">
          <div
            aria-modal="true"
            className={'modal-overlay'}
            data-aria-live="assertive"
            role="dialog"
          >
            <Tabs
              asSwitch
              bind="modal.wizardStep"
              defaultActiveTab="WhatDocumentIsThis"
            >
              <Tab tabName="WhatDocumentIsThis">
                <WhatDocumentIsThis />
              </Tab>
              <Tab tabName="ViewAllDocuments">
                <ViewAllDocumentsMobile />
              </Tab>
              <Tab tabName="ViewDocumentCategory">
                <ViewDocumentCategory />
              </Tab>
            </Tabs>
          </div>
        </dialog>
      </FocusLock>
    );
  }
}

SelectDocumentWizardOverlayComponent.propTypes = {};

export const SelectDocumentWizardOverlay = connect(
  {
    modal: state.modal,
  },
  SelectDocumentWizardOverlayComponent,
);
