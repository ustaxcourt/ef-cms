import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditOrderTitleModal } from './EditOrderTitleModal';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TextEditor } from './TextEditor';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateOrder = connect(
  {
    createOrderHelper: state.createOrderHelper,
    editorDelta: state.form.editorDelta,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openEditOrderTitleModalSequence: sequences.openEditOrderTitleModalSequence,
    refreshPdfSequence: sequences.refreshPdfSequence,
    richText: state.form.richText,
    showModal: state.modal.showModal,
    submitCourtIssuedOrderSequence: sequences.submitCourtIssuedOrderSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function CreateOrder({
    createOrderHelper,
    editorDelta,
    formCancelToggleCancelSequence,
    openEditOrderTitleModalSequence,
    refreshPdfSequence,
    richText,
    showModal,
    submitCourtIssuedOrderSequence,
    updateFormValueSequence,
    updateScreenMetadataSequence,
  }) {
    const { pageTitle } = createOrderHelper;

    return (
      <>
        <CaseDetailHeader />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'EditOrderTitleModal' && <EditOrderTitleModal />}
        <SuccessNotification />
        <ErrorNotification />

        <section className="usa-section grid-container DocumentDetail">
          <div className="grid-container padding-x-0">
            <h1 className="heading-1">
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
                <TextEditor
                  defaultValue={richText}
                  editorDelta={editorDelta}
                  updateFormValueSequence={updateFormValueSequence}
                  updateScreenMetadataSequence={updateScreenMetadataSequence}
                />
              </Tab>
              <Tab id="tab-preview" tabName="preview" title="Preview">
                <PdfPreview />
              </Tab>
            </Tabs>

            <div className="grid-row grid-gap margin-top-4">
              <div className="grid-col-8">
                <Button
                  id="save-order-button"
                  onClick={() => {
                    submitCourtIssuedOrderSequence();
                  }}
                >
                  Save
                </Button>
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
          </div>
        </section>
      </>
    );
  },
);
