import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { ViewAllDocumentsDesktop } from './ViewAllDocumentsDesktop';
import { ViewAllDocumentsMobile } from './ViewAllDocumentsMobile';
import { connect } from '@cerebral/react';
import React from 'react';

export const ViewAllDocuments = connect(
  {},
  () => {
    return (
      <React.Fragment>
        <NonMobile>
          <ViewAllDocumentsDesktop />
        </NonMobile>
        <Mobile>
          <ViewAllDocumentsMobile />
        </Mobile>
      </React.Fragment>
    );
  },
);
