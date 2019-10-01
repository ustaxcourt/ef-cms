import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { Button } from '../../ustc-ui/Button/Button';
import { CompleteDocumentTypeSection } from './CompleteDocumentTypeSection';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    completeDocumentSelectSequence: sequences.completeDocumentSelectSequence,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    gotoViewAllDocumentsSequence: sequences.gotoViewAllDocumentsSequence,
    reasons: state.viewAllDocumentsHelper.reasons,
    screenMetadata: state.screenMetadata,
    selectDocumentSequence: sequences.selectDocumentSequence,
  },
  ({
    completeDocumentSelectSequence,
    formCancelToggleCancelSequence,
    gotoViewAllDocumentsSequence,
    reasons,
  }) => {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              <h1 id="file-a-document-header" tabIndex="-1">
                What document are you filing?
              </h1>
              <div className="blue-container">
                <CompleteDocumentTypeSection />
              </div>

              <div className="button-box-container margin-top-4">
                <button
                  className="usa-button margin-right-205 margin-bottom-1"
                  id="submit-document"
                  type="submit"
                  onClick={() => {
                    completeDocumentSelectSequence();
                  }}
                >
                  Continue
                </button>
                <Button
                  link
                  onClick={() => {
                    formCancelToggleCancelSequence();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <NonMobile>
              <div className="tablet:grid-col-4 tablet:grid-offset-2 bg-white need-help-selecting">
                <div className="card">
                  <div className="content-header bg-accent-cool-dark text-white heading-2">
                    Need help selecting a document type?
                  </div>
                  <div className="content-wrapper">
                    <p>
                      Here are common reasons you might be filing a document.
                      Underneath each is a list of document types that are
                      usually associated with that reason.
                    </p>
                  </div>
                  <Accordion headingLevel="3">
                    {reasons.map(({ categories, reason }, reasonIndex) => {
                      return (
                        <AccordionItem
                          key={`reason-${reasonIndex}`}
                          title={reason}
                        >
                          {categories.map(({ category }, categoryIndex) => {
                            return (
                              <p key={`${reasonIndex}-${categoryIndex}`}>
                                {category}
                              </p>
                            );
                          })}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  <div className="content-wrapper margin-top-3">
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
            </NonMobile>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
