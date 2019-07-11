import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewAllDocuments = connect(
  {
    caseDetail: state.caseDetail,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  ({
    caseDetail,
    formCancelToggleCancelSequence,
    showModal,
    viewAllDocumentsHelper,
  }) => {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-12">
              <h1
                className="margin-bottom-05"
                id="view-all-document-header"
                tabIndex="-1"
              >
                All Document Categories
              </h1>
              <p className="margin-bottom-5 margin-top-05 ">
                Select the document type under the category you wish to file....
              </p>
              <Accordion bind="allDocumentsAccordion" headingLevel="3">
                {viewAllDocumentsHelper.sections.map((title, index) => {
                  return (
                    <AccordionItem key={`item-${index}`} title={title}>
                      <div className="all-columns-view">
                        {viewAllDocumentsHelper.categoryMap[title].map(
                          (document, index) => (
                            <button
                              className="usa-button usa-button--unstyled margin-bottom-1"
                              key={`${title}-document-${index}`}
                            >
                              {document.documentType}
                            </button>
                          ),
                        )}
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
          <div className="button-box-container margin-bottom-4">
            <a
              className="usa-button margin-right-205"
              href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
            >
              Back to File a Document
            </a>
            <button
              className="usa-button usa-button--unstyled"
              id="cancel-button"
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </button>
            {showModal === 'FormCancelModalDialogComponent' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
