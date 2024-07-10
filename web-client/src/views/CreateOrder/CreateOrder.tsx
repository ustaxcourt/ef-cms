import { AddDocketNumbersModal } from './AddDocketNumbersModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditOrderTitleModal } from './EditOrderTitleModal';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TextEditor } from './TextEditor';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CreateOrder = connect(
  {
    createOrderHelper: state.createOrderHelper,
    editorDelta: state.form.editorDelta,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openAddDocketNumbersModalSequence:
      sequences.openAddDocketNumbersModalSequence,
    openEditOrderTitleModalSequence: sequences.openEditOrderTitleModalSequence,
    refreshPdfSequence: sequences.refreshPdfSequence,
    richText: state.form.richText,
    showModal: state.modal.showModal,
    submitCourtIssuedOrderSequence: sequences.submitCourtIssuedOrderSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateCourtOrderSequence: sequences.validateCourtOrderSequence,
    validationErrors: state.validationErrors,
  },
  function CreateOrder({
    createOrderHelper,
    editorDelta,
    formCancelToggleCancelSequence,
    openAddDocketNumbersModalSequence,
    openEditOrderTitleModalSequence,
    refreshPdfSequence,
    richText,
    showModal,
    submitCourtIssuedOrderSequence,
    updateFormValueSequence,
    updateScreenMetadataSequence,
    validateCourtOrderSequence,
    validationErrors,
  }) {
    const { pageTitle } = createOrderHelper;

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <h1
              className="heading-1"
              data-testid="create-order-page-title"
              id="page-title"
            >
              {pageTitle}{' '}
              <Button
                link
                className="margin-left-1"
                icon="edit"
                onClick={() => openEditOrderTitleModalSequence()}
              >
                Edit Title
              </Button>
            </h1>

            <Tabs
              bind="createOrderTab"
              className="tab-border tab-button-h2"
              onSelect={selectedTabName =>
                selectedTabName === 'preview' && refreshPdfSequence()
              }
            >
              <Tab id="tab-generate" tabName="generate" title="Generate">
                {createOrderHelper.showAddDocketNumbersButton && (
                  <Button
                    link
                    className="padding-top-0"
                    data-testid="add-docket-number-btn"
                    icon={createOrderHelper.addDocketNumbersButtonIcon}
                    id="add-docket-numbers-btn"
                    onClick={() => {
                      openAddDocketNumbersModalSequence();
                    }}
                  >
                    {createOrderHelper.addDocketNumbersButtonText}
                  </Button>
                )}

                <FormGroup
                  grow
                  omitFormGroupClass
                  errorText={validationErrors.documentContents}
                >
                  <TextEditor
                    defaultValue={richText}
                    editorDelta={editorDelta}
                    updateFormValueSequence={v => {
                      if (v.key === 'documentContents') {
                        v.value = v.value.trim();
                      }
                      updateFormValueSequence(v);
                      validateCourtOrderSequence();
                    }}
                    updateScreenMetadataSequence={updateScreenMetadataSequence}
                  />
                </FormGroup>
              </Tab>
              <Tab id="tab-preview" tabName="preview" title="Preview">
                <PdfPreview />
              </Tab>
            </Tabs>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
                  data-testid="save-order-button"
                  id="save-order-button"
                  onClick={() => {
                    submitCourtIssuedOrderSequence();
                  }}
                >
                  Save
                </Button>
                <Button
                  link
                  id="cancel-order"
                  onClick={() => {
                    formCancelToggleCancelSequence();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </section>

        {showModal === 'AddDocketNumbersModal' && <AddDocketNumbersModal />}

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'EditOrderTitleModal' && <EditOrderTitleModal />}
      </>
    );
  },
);

CreateOrder.displayName = 'CreateOrder';
