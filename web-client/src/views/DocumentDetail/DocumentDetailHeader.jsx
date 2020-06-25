import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentDetailHeader = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    caseDetail: state.caseDetail,
    documentDetailHelper: state.documentDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
  },
  function DocumentDetailHeader({
    archiveDraftDocumentModalSequence,
    caseDetail,
    documentDetailHelper,
    formattedCaseDetail,
    openConfirmEditModalSequence,
  }) {
    return (
      <>
        <h2 className="heading-1">
          {documentDetailHelper.formattedDocument.documentTitle ||
            documentDetailHelper.formattedDocument.documentType}
          {documentDetailHelper.isDraftDocument && ' - DRAFT'}
        </h2>
        <div className="filed-by">
          {documentDetailHelper.showCreatedFiled && (
            <div className="padding-bottom-1">
              {documentDetailHelper.createdFiledLabel}{' '}
              {documentDetailHelper.formattedDocument.createdAtFormatted}
              {documentDetailHelper.formattedDocument.filedBy &&
                ` by ${documentDetailHelper.formattedDocument.filedBy}`}
            </div>
          )}
          {documentDetailHelper.formattedDocument.qcInfo && (
            <div>
              QC completed on{' '}
              {documentDetailHelper.formattedDocument.qcInfo.date} by{' '}
              {documentDetailHelper.formattedDocument.qcInfo.name}
            </div>
          )}
          {documentDetailHelper.formattedDocument.showServedAt && (
            <div>
              Served {documentDetailHelper.formattedDocument.servedAtFormatted}
            </div>
          )}
          {documentDetailHelper.formattedDocument.showLegacySealed && (
            <div>Sealed in Blackstone</div>
          )}
        </div>
        <div>
          {documentDetailHelper.isDraftDocument && (
            <div>
              <>
                {documentDetailHelper.showConfirmEditOrder ? (
                  <Button
                    link
                    icon="edit"
                    onClick={() => {
                      openConfirmEditModalSequence({
                        caseId: formattedCaseDetail.caseId,
                        docketNumber: formattedCaseDetail.docketNumber,
                        documentIdToEdit:
                          documentDetailHelper.formattedDocument.documentId,
                        path: documentDetailHelper.formattedDocument.editUrl,
                      });
                    }}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    link
                    href={documentDetailHelper.formattedDocument.editUrl}
                    icon="edit"
                  >
                    Edit
                  </Button>
                )}

                <Button
                  link
                  className="red-warning margin-right-0 no-wrap"
                  icon="trash"
                  onClick={() => {
                    archiveDraftDocumentModalSequence({
                      caseId: caseDetail.caseId,
                      documentId:
                        documentDetailHelper.formattedDocument.documentId,
                      documentTitle:
                        documentDetailHelper.formattedDocument.documentType,
                      redirectToCaseDetail: true,
                    });
                  }}
                >
                  Delete
                </Button>
              </>
            </div>
          )}
        </div>
      </>
    );
  },
);
