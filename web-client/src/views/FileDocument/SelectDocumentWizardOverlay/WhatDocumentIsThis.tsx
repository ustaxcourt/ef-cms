import { Button } from '../../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const WhatDocumentIsThis = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    clearModalSequence: sequences.clearModalSequence,
    overlayRef: props.overlayRef,
    reasons: state.viewAllDocumentsHelper.reasons,
    updateModalValueSequence: sequences.updateModalValueSequence,
  },
  function WhatDocumentIsThis({
    chooseModalWizardStepSequence,
    clearModalSequence,
    overlayRef,
    reasons,
    updateModalValueSequence,
  }) {
    if (overlayRef && overlayRef.current) {
      overlayRef.current.scrollTo(0, 0);
    }
    return (
      <React.Fragment>
        <div className="overlay-blue-header">
          <div className="grid-container">
            <Button
              link
              aria-roledescription="button to return to document selection"
              className="heading-3 text-left"
              onClick={() => clearModalSequence()}
            >
              <FontAwesomeIcon icon="caret-left" />
              What document are you filing?
            </Button>
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h1
                className="margin-bottom-105"
                id="view-all-document-header"
                tabIndex={-1}
              >
                What is this document for?
              </h1>
              <p className="margin-bottom-0">
                Here are common reasons you might be filing a document.
                Underneath each is a list of document types that are usually
                associated with that reason.
              </p>
            </div>
          </div>
        </div>

        {reasons.map(({ categories, reason }) => {
          return (
            <React.Fragment key={`reason-${reason}`}>
              <div className="grid-container">
                <div className="grid-row">
                  <div className="grid-col-12">
                    <h2 className="margin-top-4 margin-bottom-3" tabIndex={-1}>
                      {reason}
                    </h2>
                  </div>
                </div>
              </div>
              <div>
                {categories.map(({ category }) => {
                  return (
                    <div
                      className="category-view grid-container padding-bottom-1 padding-top-1"
                      key={`${reason}-${category}`}
                    >
                      <Button
                        link
                        className="text-left"
                        onClick={() => {
                          updateModalValueSequence({
                            key: 'category',
                            value: category,
                          });
                          updateModalValueSequence({
                            key: 'from',
                            value: 'WhatDocumentIsThis',
                          });
                          updateModalValueSequence({
                            key: 'fromLabel',
                            value: 'What is this document for?',
                          });
                          chooseModalWizardStepSequence({
                            value: 'ViewDocumentCategory',
                          });
                        }}
                      >
                        {category}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

        <div className="grid-container margin-bottom-2">
          <div className="margin-top-5">
            <Button
              id="view-all-documents"
              onClick={() =>
                chooseModalWizardStepSequence({
                  value: 'ViewAllDocuments',
                })
              }
            >
              View All Document Categories
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

WhatDocumentIsThis.displayName = 'WhatDocumentIsThis';
