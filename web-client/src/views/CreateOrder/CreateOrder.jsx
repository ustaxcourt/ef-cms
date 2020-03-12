import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
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
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    refreshPdfWhenSwitchingCreateOrderTabSequence:
      sequences.refreshPdfWhenSwitchingCreateOrderTabSequence,
    showModal: state.showModal,
    submitCourtIssuedOrderSequence: sequences.submitCourtIssuedOrderSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  ({
    createOrderHelper,
    form,
    formCancelToggleCancelSequence,
    refreshPdfWhenSwitchingCreateOrderTabSequence,
    showModal,
    submitCourtIssuedOrderSequence,
    updateFormValueSequence,
    updateScreenMetadataSequence,
  }) => {
    const { pageTitle } = createOrderHelper;

    return (
      <>
        <CaseDetailHeader />
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        <SuccessNotification />
        <ErrorNotification />

        <section className="usa-section grid-container DocumentDetail">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <h2 className="heading-1">{pageTitle}</h2>
              </div>
            </div>

            <Tabs
              bind="createOrderTab"
              className="classic-horizontal-header3 tab-border"
              onSelect={() => refreshPdfWhenSwitchingCreateOrderTabSequence()}
            >
              <Tab id="tab-generate" tabName="generate" title="Generate">
                <TextEditor
                  defaultValue={form.richText}
                  form={form}
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
