import { ViewAllDocumentsDesktop } from './ViewAllDocumentsDesktop';
import { connect } from '@cerebral/react';
import React from 'react';

export const ViewAllDocuments = connect(
  {},
  () => {
    return (
      <React.Fragment>
        <ViewAllDocumentsDesktop />
      </React.Fragment>
    );
  },
);
