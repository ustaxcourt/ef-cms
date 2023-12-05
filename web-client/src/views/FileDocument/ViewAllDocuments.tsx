import { ViewAllDocumentsDesktop } from './ViewAllDocumentsDesktop';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const ViewAllDocuments = connect({}, function ViewAllDocuments() {
  return (
    <React.Fragment>
      <ViewAllDocumentsDesktop />
    </React.Fragment>
  );
});

ViewAllDocuments.displayName = 'ViewAllDocuments';
