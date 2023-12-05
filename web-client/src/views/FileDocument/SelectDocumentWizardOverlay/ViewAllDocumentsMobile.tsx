import { Button } from '../../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ViewAllDocumentsMobile = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    overlayRef: props.overlayRef,
    updateModalValueSequence: sequences.updateModalValueSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  function ViewAllDocumentsMobile({
    chooseModalWizardStepSequence,
    overlayRef,
    updateModalValueSequence,
    viewAllDocumentsHelper,
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
              aria-roledescription="button to return to What is this document for?"
              className="heading-3 text-left"
              onClick={() =>
                chooseModalWizardStepSequence({
                  value: 'WhatDocumentIsThis',
                })
              }
            >
              <FontAwesomeIcon icon="caret-left" />
              What is this document for?
            </Button>
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <h1 className="margin-bottom-105" tabIndex={-1}>
                All Document Categories
              </h1>
              <h2 className="margin-bottom-3" tabIndex={-1}>
                Select Document Category
              </h2>
            </div>
          </div>
        </div>
        <div className="margin-bottom-2">
          {viewAllDocumentsHelper.sections.map(title => {
            return (
              <div
                className="category-view grid-container padding-bottom-1 padding-top-1"
                key={`${title}-document`}
              >
                <Button
                  link
                  className="text-left"
                  onClick={() => {
                    updateModalValueSequence({
                      key: 'category',
                      value: title,
                    });
                    updateModalValueSequence({
                      key: 'from',
                      value: 'ViewAllDocuments',
                    });
                    updateModalValueSequence({
                      key: 'fromLabel',
                      value: 'All Document Categories',
                    });
                    chooseModalWizardStepSequence({
                      value: 'ViewDocumentCategory',
                    });
                  }}
                >
                  {title}
                </Button>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  },
);

ViewAllDocumentsMobile.displayName = 'ViewAllDocumentsMobile';
