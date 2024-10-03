import { Button } from '@web-client/ustc-ui/Button/Button';
import { OpenPractitionerCaseListPdfModal } from './OpenPractitionerCaseListPdfModal';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { PractitionerCaseList } from './PractitionerCaseList';
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
    gotoPrintPractitionerCasesSequence:
      sequences.gotoPrintPractitionerCasesSequence,
    onPractitionerInformationTabSelectSequence:
      sequences.onPractitionerInformationTabSelectSequence,
    practitionerDetailHelper: state.practitionerDetailHelper,
    practitionerInformationHelper: state.practitionerInformationHelper,
    setPractitionerClosedCasesPageSequence:
      sequences.setPractitionerClosedCasesPageSequence,
    setPractitionerOpenCasesPageSequence:
      sequences.setPractitionerOpenCasesPageSequence,
    showModal: state.modal.showModal,
  },
  function PractitionerInformation({
    gotoPrintPractitionerCasesSequence,
    onPractitionerInformationTabSelectSequence,
    practitionerInformationHelper,
    setPractitionerClosedCasesPageSequence,
    setPractitionerOpenCasesPageSequence,
    showModal,
  }) {
    const numOpenCases = practitionerInformationHelper.openCasesTotal || 0;
    const numClosedCases = practitionerInformationHelper.closedCasesTotal || 0;

    const openPagesPaginator = () => {
      return (
        practitionerInformationHelper.showOpenCasesPagination && (
          <Paginator
            currentPageIndex={practitionerInformationHelper.openCasesPageNumber}
            showSinglePage={true}
            totalPages={practitionerInformationHelper.totalOpenCasesPages}
            onPageChange={selectedPage => {
              setPractitionerOpenCasesPageSequence({
                pageNumber: selectedPage,
              });
            }}
          />
        )
      );
    };

    const closedPagesPaginator = () => {
      return (
        practitionerInformationHelper.showClosedCasesPagination && (
          <Paginator
            currentPageIndex={
              practitionerInformationHelper.closedCasesPageNumber
            }
            showSinglePage={true}
            totalPages={practitionerInformationHelper.totalClosedCasesPages}
            onPageChange={selectedPage => {
              setPractitionerClosedCasesPageSequence({
                pageNumber: selectedPage,
              });
            }}
          />
        )
      );
    };

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
            onSelect={tabName => {
              onPractitionerInformationTabSelectSequence({
                tabName,
              });
            }}
          >
            {practitionerInformationHelper.showPrintCaseListLink && (
              <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
                <Button
                  link
                  className="margin-top-1"
                  data-testid="print-practitioner-case-list"
                  icon="print"
                  overrideMargin={true}
                  onClick={() => {
                    gotoPrintPractitionerCasesSequence({
                      userId: practitionerInformationHelper.userId,
                    });
                  }}
                >
                  Print case list
                </Button>
              </div>
            )}
            <Tab tabName="practitioner-details" title={'Details'}>
              <PractitionerDetails />
            </Tab>
            {practitionerInformationHelper.showDocumentationTab && (
              <Tab tabName="practitioner-documentation" title={'Documentation'}>
                <PractitionerDocumentation />
              </Tab>
            )}
            <Tab
              tabName="practitioner-open-cases"
              title={`Open Cases (${numOpenCases})`}
            >
              {openPagesPaginator()}
              <PractitionerCaseList
                caseType={'open'}
                cases={practitionerInformationHelper.openCasesToDisplay}
              />
              {openPagesPaginator()}
            </Tab>
            <Tab
              tabName="practitioner-closed-cases"
              title={`Closed Cases (${numClosedCases})`}
            >
              {closedPagesPaginator()}
              <PractitionerCaseList
                caseType={'closed'}
                cases={practitionerInformationHelper.closedCasesToDisplay}
              />
              {closedPagesPaginator()}
            </Tab>
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
