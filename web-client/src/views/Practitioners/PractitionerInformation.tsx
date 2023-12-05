import { OpenPractitionerCaseListPdfModal } from './OpenPractitionerCaseListPdfModal';
import { PractitionerDetails } from './PractitionerDetails';
import { PractitionerDocumentation } from './PractitionerDocumentation';
import { PractitionerUserHeader } from './PractitionerUserHeader';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerInformation = connect(
  {
    onPractitionerInformationTabSelectSequence:
      sequences.onPractitionerInformationTabSelectSequence,
    showDocumentationTab:
      state.practitionerInformationHelper.showDocumentationTab,
    showModal: state.modal.showModal,
  },
  function PractitionerInformation({
    onPractitionerInformationTabSelectSequence,
    showDocumentationTab,
    showModal,
  }) {
    return (
      <React.Fragment>
        <PractitionerUserHeader />

        <div className="grid-container">
          <div className="grid-row grid-gap">
            {/* used to be col-8, 12 necessary? check this out */}
            <div className="grid-col-12">
              <SuccessNotification />
            </div>
          </div>
        </div>

        <section className="usa-section grid-container">
          <Tabs
            bind="currentViewMetadata.tab"
            className="classic-horizontal-header3 tab-border"
            defaultActiveTab="practitioner-details"
            marginBottom={false}
            onSelect={tabName => {
              onPractitionerInformationTabSelectSequence({
                tabName,
              });
            }}
          >
            <Tab tabName="practitioner-details" title={'Details'}>
              <PractitionerDetails />
            </Tab>
            {showDocumentationTab && (
              <Tab tabName="practitioner-documentation" title={'Documentation'}>
                <PractitionerDocumentation />
              </Tab>
            )}
          </Tabs>
        </section>

        {showModal === 'OpenPractitionerCaseListPdfModal' && (
          <OpenPractitionerCaseListPdfModal />
        )}
      </React.Fragment>
    );
  },
);

PractitionerInformation.displayName = 'PractitionerInformation';
