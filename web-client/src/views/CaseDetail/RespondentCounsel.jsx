import { AddIrsPractitionerModal } from './AddIrsPractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { RespondentExistsModal } from './RespondentExistsModal';
import { RespondentSearch } from './RespondentSearch';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const RespondentCounsel = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    partiesInformationHelper: state.partiesInformationHelper,
    showModal: state.modal.showModal,
  },
  function RespondentCounsel({
    caseDetail,
    caseInformationHelper,
    partiesInformationHelper,
    showModal,
  }) {
    return (
      <>
        <div className="grid-row margin-bottom-2">
          <div className="grid-col-6">
            <h2>Respondent Counsel</h2>
          </div>
          {caseInformationHelper.showAddCounsel && <RespondentSearch />}
        </div>

        <div className="grid-row grid-gap-2">
          {partiesInformationHelper.formattedRespondents.map(
            irsPractitioner => (
              <div
                className="tablet:grid-col-9 mobile:grid-col-9 desktop:grid-col-4 margin-bottom-4 petitioner-card"
                key={irsPractitioner.userId}
              >
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper parties-card">
                    <h3 className="text-wrap">
                      {irsPractitioner.name} {`(${irsPractitioner.barNumber})`}
                    </h3>
                    <div className="bg-primary text-white padding-1 margin-bottom-2">
                      Respondent Counsel
                      {irsPractitioner.canEditRespondent && (
                        <Button
                          link
                          className="width-auto white-edit-link padding-0 margin-right-0 float-right"
                          href={`/case-detail/${caseDetail.docketNumber}/edit-respondent-counsel/${irsPractitioner.barNumber}`}
                          icon="edit"
                          id="edit-respondent-counsel"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    <AddressDisplay
                      contact={{
                        ...irsPractitioner.contact,
                        name: undefined,
                      }}
                      showEmail={false}
                    />
                    <span className="address-line">
                      {irsPractitioner.formattedEmail}
                    </span>
                    {irsPractitioner.formattedPendingEmail}
                    {irsPractitioner.serviceIndicator && (
                      <div className="margin-top-4">
                        <p className="semi-bold margin-bottom-0">
                          Service preference
                        </p>
                        {irsPractitioner.serviceIndicator}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
          {partiesInformationHelper.formattedRespondents.length < 1 &&
            'There is no respondent counsel associated with this case.'}
        </div>
        {showModal === 'AddIrsPractitionerModal' && <AddIrsPractitionerModal />}
        {showModal === 'RespondentExistsModal' && <RespondentExistsModal />}
      </>
    );
  },
);

export { RespondentCounsel };
