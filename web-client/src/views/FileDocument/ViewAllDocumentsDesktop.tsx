import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { Button } from '../../ustc-ui/Button/Button';
import { CompleteSelectDocumentModalDialog } from './CompleteSelectDocumentModalDialog';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ViewAllDocumentsDesktop = connect(
  {
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    openCompleteSelectDocumentTypeModalSequence:
      sequences.openCompleteSelectDocumentTypeModalSequence,
    showModal: state.modal.showModal,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  function ViewAllDocumentsDesktop({
    formCancelToggleCancelSequence,
    navigateBackSequence,
    openCompleteSelectDocumentTypeModalSequence,
    showModal,
    updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row grid-gap margin-bottom-5">
            <div className="tablet:grid-col-12">
              <h1
                className="margin-bottom-05"
                id="view-all-document-header"
                tabIndex={-1}
              >
                All Document Categories
              </h1>
              <p className="margin-bottom-5 margin-top-05">
                Expand a document category and select the document type you wish
                to file.
              </p>
              <Accordion bind="allDocumentsAccordion" headingLevel="3">
                {viewAllDocumentsHelper.sections.map(title => {
                  return (
                    <AccordionItem key={`item-${title}`} title={title}>
                      <div className="all-columns-view">
                        {viewAllDocumentsHelper.categoryMap[title].map(doc => (
                          <Button
                            link
                            className="text-left"
                            key={`${title}-document-${doc.eventCode}`}
                            onClick={() => {
                              updateFileDocumentWizardFormValueSequence({
                                key: 'category',
                                value: doc.category,
                              });
                              updateFileDocumentWizardFormValueSequence({
                                key: 'documentType',
                                value: doc.documentType,
                              });
                              updateFileDocumentWizardFormValueSequence({
                                key: 'documentTitle',
                                value: doc.documentTitle,
                              });
                              updateFileDocumentWizardFormValueSequence({
                                key: 'eventCode',
                                value: doc.eventCode,
                              });
                              updateFileDocumentWizardFormValueSequence({
                                key: 'scenario',
                                value: doc.scenario,
                              });
                              openCompleteSelectDocumentTypeModalSequence();
                            }}
                          >
                            {doc.documentType}
                          </Button>
                        ))}
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
          <div className="margin-bottom-4">
            <Button id="back-button" onClick={() => navigateBackSequence()}>
              Back to File a Document
            </Button>
            <Button
              link
              id="cancel-button"
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
            )}
            {showModal === 'CompleteSelectDocumentModalDialog' && (
              <CompleteSelectDocumentModalDialog />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);

ViewAllDocumentsDesktop.displayName = 'ViewAllDocumentsDesktop';
