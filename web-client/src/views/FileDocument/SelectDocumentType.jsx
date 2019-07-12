import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { CompleteDocumentTypeSection } from './CompleteDocumentTypeSection';
import { DocumentType } from './DocumentType';
import { DocumentTypeReadOnly } from './DocumentTypeReadOnly';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    completeDocumentSelectSequence: sequences.completeDocumentSelectSequence,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    gotoViewAllDocumentsSequence: sequences.gotoViewAllDocumentsSequence,
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
  },
  ({
    completeDocumentSelectSequence,
    formCancelToggleCancelSequence,
    gotoViewAllDocumentsSequence,
    screenMetadata,
    selectDocumentSequence,
  }) => {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              <h2
                className="heading-1"
                id="file-a-document-header"
                tabIndex="-1"
              >
                What document are you filing?
              </h2>
              <div className="blue-container">
                <NonMobile>
                  <CompleteDocumentTypeSection />
                </NonMobile>
                <Mobile>
                  {!screenMetadata.isDocumentTypeSelected && <DocumentType />}
                  {screenMetadata.isDocumentTypeSelected && (
                    <DocumentTypeReadOnly />
                  )}
                </Mobile>
              </div>

              <div className="button-box-container margin-top-4">
                <NonMobile>
                  <button
                    className="usa-button margin-right-205"
                    id="submit-document"
                    type="submit"
                    onClick={() => {
                      completeDocumentSelectSequence();
                    }}
                  >
                    Continue
                  </button>
                </NonMobile>
                <Mobile>
                  <button
                    className="usa-button margin-right-205"
                    id="submit-document"
                    type="submit"
                    onClick={() => {
                      selectDocumentSequence();
                    }}
                  >
                    Continue
                  </button>
                </Mobile>
                <button
                  className="usa-button usa-button--unstyled"
                  type="button"
                  onClick={() => {
                    formCancelToggleCancelSequence();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="tablet:grid-col-4 tablet:grid-offset-2 bg-white need-help-selecting">
              <div className="card">
                <div className="content-header bg-accent-cool-dark text-white heading-2">
                  Need help selecting a document type?
                </div>
                <div className="content-wrapper">
                  <p>
                    Here are common reasons you might be filing a document.
                    Underneath each is a list of document types that are usually
                    associated with that reason.
                  </p>
                </div>
                <Accordion headingLevel="3">
                  <AccordionItem title="Request Something From the Court">
                    <p>Application</p>
                    <p>Motion</p>
                    <p>Petition</p>
                  </AccordionItem>
                  <AccordionItem title="Notify the Court of a Change">
                    <p>Brief</p>
                    <p>Memorandum</p>
                    <p>Notice</p>
                    <p>Statement</p>
                    <p>Stipulation</p>
                  </AccordionItem>
                  <AccordionItem title="Update or Add to a Document">
                    <p>Miscellaneous</p>
                    <p>Supporting Documents</p>
                  </AccordionItem>
                  <AccordionItem title="Respond to a Previous Document">
                    <p>Motion</p>
                    <p>Reply</p>
                    <p>Response</p>
                  </AccordionItem>
                </Accordion>
                <div className="content-wrapper">
                  <div>
                    <button
                      className="usa-button usa-button--outline"
                      id="view-all-documents"
                      onClick={() => gotoViewAllDocumentsSequence()}
                    >
                      View All Document Categories
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
