import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditDocketEntryMetaDocketEntryPreview } from './EditDocketEntryMetaDocketEntryPreview';
import { EditDocketEntryMetaFormCourtIssued } from './EditDocketEntryMetaFormCourtIssued';
import { EditDocketEntryMetaFormDocument } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormNoDocument } from './EditDocketEntryMetaFormNoDocument';
import { EditDocketEntryMetaTabAction } from './EditDocketEntryMetaTabAction';
import { EditDocketEntryMetaTabService } from './EditDocketEntryMetaTabService';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMeta = connect(
  {
    editType: state.screenMetadata.editType,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditDocketEntryMetaSequence:
      sequences.submitEditDocketEntryMetaSequence,
  },
  function EditDocketEntryMeta({
    editType,
    formCancelToggleCancelSequence,
    showModal,
    submitEditDocketEntryMetaSequence,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-5 title">
              <h1>Docket Entry</h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div className="margin-top-1 margin-bottom-1 docket-entry-preview-text edit-docket--visible-overflow">
                  <span className="text-bold">Docket Entry preview: </span>
                  <EditDocketEntryMetaDocketEntryPreview />
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5 DocumentDetail">
              <Tabs
                boxed
                bind="editDocketEntryMetaTab"
                className="no-full-border-bottom tab-button-h3 container-tabs"
              >
                <Tab
                  id="tab-document-info"
                  tabName="documentInfo"
                  title="Document Info"
                >
                  {editType === 'CourtIssued' && (
                    <EditDocketEntryMetaFormCourtIssued />
                  )}
                  {editType === 'Document' && (
                    <EditDocketEntryMetaFormDocument />
                  )}
                  {editType === 'NoDocument' && (
                    <EditDocketEntryMetaFormNoDocument />
                  )}
                </Tab>
                <Tab id="tab-service" tabName="service" title="Service">
                  <EditDocketEntryMetaTabService />
                </Tab>
                <Tab
                  data-testid="tab-action"
                  id="tab-action"
                  tabName="action"
                  title="Action(s)"
                >
                  <EditDocketEntryMetaTabAction />
                </Tab>
              </Tabs>

              <div className="margin-top-3">
                <Button
                  onClick={() => {
                    submitEditDocketEntryMetaSequence();
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
            <div className="grid-col-7">{/* TODO: File preview */}</div>
          </div>
        </section>
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
      </>
    );
  },
);

EditDocketEntryMeta.displayName = 'EditDocketEntryMeta';
