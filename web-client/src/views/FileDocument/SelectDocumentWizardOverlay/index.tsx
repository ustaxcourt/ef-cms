import { Overlay } from '../../../ustc-ui/Overlay/Overlay';
import { Tab, Tabs } from '../../../ustc-ui/Tabs/Tabs';
import { ViewAllDocumentsMobile } from './ViewAllDocumentsMobile';
import { ViewDocumentCategory } from './ViewDocumentCategory';
import { WhatDocumentIsThis } from './WhatDocumentIsThis';
import React from 'react';

export const SelectDocumentWizardOverlay = () => {
  const ref = React.createRef();

  return (
    <Overlay ref={ref} onEscSequence="clearModalSequence">
      <Tabs
        asSwitch
        bind="modal.wizardStep"
        defaultActiveTab="WhatDocumentIsThis"
      >
        <Tab tabName="WhatDocumentIsThis">
          <WhatDocumentIsThis overlayRef={ref} />
        </Tab>
        <Tab tabName="ViewAllDocuments">
          <ViewAllDocumentsMobile overlayRef={ref} />
        </Tab>
        <Tab tabName="ViewDocumentCategory">
          <ViewDocumentCategory overlayRef={ref} />
        </Tab>
      </Tabs>
    </Overlay>
  );
};

SelectDocumentWizardOverlay.displayName = 'SelectDocumentWizardOverlay';
