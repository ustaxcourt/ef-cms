import { OpenPractitionerCaseListPdfModal } from './OpenPractitionerCaseListPdfModal';
import { PractitionerDetails } from './PractitionerDetails';
import { PractitionerDocumentation } from './PractitionerDocumentation';
import { PractitionerUserHeader } from './PractitionerUserHeader';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerInformation = connect(
  {
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
    showModal: state.modal.showModal,
  },
  function PractitionerInformation({
    practitionerDocumentationHelper,
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
          >
            <Tab tabName="practitioner-details" title={'Details'}>
              <PractitionerDetails />
            </Tab>
            {practitionerDocumentationHelper.showDocumentationTab && (
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
