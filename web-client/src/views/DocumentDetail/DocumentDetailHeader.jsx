import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DocumentDetailHeader = connect(
  {
    documentDetailHelper: state.documentDetailHelper,
  },
  ({ documentDetailHelper }) => {
    return (
      <>
        <h2 className="heading-1">
          {documentDetailHelper.formattedDocument.documentTitle ||
            documentDetailHelper.formattedDocument.documentType}
          {documentDetailHelper.isDraftDocument && ' - DRAFT'}
        </h2>
        <div className="filed-by">
          <div className="padding-bottom-1">
            Filed {documentDetailHelper.formattedDocument.createdAtFormatted}
            {documentDetailHelper.formattedDocument.filedBy &&
              ` by ${documentDetailHelper.formattedDocument.filedBy}`}
          </div>
          {documentDetailHelper.formattedDocument.showServedAt && (
            <div>
              Served {documentDetailHelper.formattedDocument.servedAtFormatted}
            </div>
          )}
        </div>
      </>
    );
  },
);
