import { Button } from '../../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ViewDocumentCategory = connect(
  {
    chooseModalWizardStepSequence: sequences.chooseModalWizardStepSequence,
    clearModalSequence: sequences.clearModalSequence,
    modal: state.modal,
    overlayRef: props.overlayRef,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  function ViewDocumentCategory({
    chooseModalWizardStepSequence,
    clearModalSequence,
    modal,
    overlayRef,
    updateFileDocumentWizardFormValueSequence,
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
              aria-roledescription={`button to return to ${modal.fromLabel}`}
              className="heading-3 text-left"
              onClick={() =>
                chooseModalWizardStepSequence({
                  value: modal.from,
                })
              }
            >
              <FontAwesomeIcon icon="caret-left" />
              {modal.fromLabel}
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
                {modal.category}
              </h1>
              <h2
                className="margin-bottom-205"
                id="view-all-document-sub-header"
                tabIndex={-1}
              >
                Select document type
              </h2>
            </div>
          </div>
        </div>
        <div>
          {viewAllDocumentsHelper.categoryMap[modal.category].map(doc => (
            <div
              className="category-view grid-container padding-bottom-1 padding-top-1"
              key={`document-${doc.documentTitle}`}
            >
              <Button
                link
                className="text-left"
                onClick={() => {
                  const prefix =
                    (modal.forSecondary && 'secondaryDocument.') || '';
                  updateFileDocumentWizardFormValueSequence({
                    key: `${prefix}category`,
                    value: doc.category,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: `${prefix}documentType`,
                    value: doc.documentType,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: `${prefix}documentTitle`,
                    value: doc.documentTitle,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: `${prefix}eventCode`,
                    value: doc.eventCode,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: `${prefix}scenario`,
                    value: doc.scenario,
                  });
                  clearModalSequence();
                }}
              >
                {doc.documentType}
              </Button>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  },
);

ViewDocumentCategory.displayName = 'ViewDocumentCategory';
