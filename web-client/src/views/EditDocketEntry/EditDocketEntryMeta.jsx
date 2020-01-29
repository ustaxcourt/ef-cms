import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditDocketEntryMetaDocketEntryPreview } from './EditDocketEntryMetaDocketEntryPreview';
import { EditDocketEntryMetaFormCourtIssued } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormDocument } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormNoDocument } from './EditDocketEntryMetaFormNoDocument';
import { EditDocketEntryMetaTabAction } from './EditDocketEntryMetaTabAction';
import { EditDocketEntryMetaTabService } from './EditDocketEntryMetaTabService';
import { ErrorNotification } from '../ErrorNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMeta = connect(
  {
    caseDetail: state.caseDetail,
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    submitSequence: sequences.submitEditDocketEntryMetaSequence,
  },
  ({ caseDetail, editDocketEntryMetaHelper, submitSequence }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />

          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <h1 className="margin-bottom-105">Docket Entry</h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div className="margin-top-1 margin-bottom-1 docket-entry-preview-text">
                  <span className="text-bold">Docket Entry Preview: </span>
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
                  {editDocketEntryMetaHelper.docketEntryMetaFormComponent ===
                    'CourtIssued' && <EditDocketEntryMetaFormCourtIssued />}

                  {editDocketEntryMetaHelper.docketEntryMetaFormComponent ===
                    'Document' && <EditDocketEntryMetaFormDocument />}

                  {editDocketEntryMetaHelper.docketEntryMetaFormComponent ===
                    'NoDocument' && <EditDocketEntryMetaFormNoDocument />}
                </Tab>
                <Tab id="tab-service" tabName="service" title="Service">
                  <EditDocketEntryMetaTabService />
                </Tab>
                <Tab id="tab-action" tabName="action" title="Action(s)">
                  <EditDocketEntryMetaTabAction />
                </Tab>
              </Tabs>

              <div className="margin-top-3">
                <Button
                  onClick={() => {
                    submitSequence();
                  }}
                >
                  Save
                </Button>

                <Button link href={`/case-detail/${caseDetail.docketNumber}`}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="grid-col-7">{/* TODO: File preview */}</div>
          </div>
        </section>
      </>
    );
  },
);
