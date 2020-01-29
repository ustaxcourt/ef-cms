import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { EditDocketEntryMetaFormCourtIssued } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormDocument } from './EditDocketEntryMetaFormDocument';
import { EditDocketEntryMetaFormNoDocument } from './EditDocketEntryMetaFormNoDocument';
import { EditDocketEntryMetaTabAction } from './EditDocketEntryMetaTabAction';
import { EditDocketEntryMetaTabService } from './EditDocketEntryMetaTabService';
import { ErrorNotification } from '../ErrorNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMeta = connect(
  {
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
  },
  ({ editDocketEntryMetaHelper }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />

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
            </div>
            <div className="grid-col-7">{/* TODO: File preview */}</div>
          </div>
        </section>
      </>
    );
  },
);
