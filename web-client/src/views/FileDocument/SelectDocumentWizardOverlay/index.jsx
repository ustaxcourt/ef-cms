import { Overlay } from '../../../ustc-ui/Overlay/Overlay';
import { Tab, Tabs } from '../../../ustc-ui/Tabs/Tabs';
import { ViewAllDocumentsMobile } from './ViewAllDocumentsMobile';
import { ViewDocumentCategory } from './ViewDocumentCategory';
import { WhatDocumentIsThis } from './WhatDocumentIsThis';
import React from 'react';

export const SelectDocumentWizardOverlay = () => (
  <Overlay onEscSequence="clearModalSequence">
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
  </Overlay>
);
