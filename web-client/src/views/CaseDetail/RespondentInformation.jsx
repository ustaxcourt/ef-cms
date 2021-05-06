import { AddIrsPractitionerModal } from './AddIrsPractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RespondentExistsModal } from './RespondentExistsModal';
import { RespondentSearch } from './RespondentSearch';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RespondentInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    showModal: state.modal.showModal,
  },
  function RespondentInformation({
    caseDetailHelper,
    caseInformationHelper,
    formattedCaseDetail,
    showModal,
  }) {
    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.irsPractitioners &&
            formattedCaseDetail.irsPractitioners.map((respondent, index) => (
              <div
                className={classNames(
                  'tablet:grid-col-3 counsel-information',
                  index > 3 && 'margin-top-3',
                )}
                key={respondent.name}
              >
                <address aria-labelledby="respondent-label">
                  {respondent.name && (
                    <AddressDisplay
                      showEmail
                      contact={{
                        ...respondent,
                        ...respondent.contact,
                      }}
                      nameOverride={respondent.name}
                    />
                  )}
                </address>
                {respondent.serviceIndicator && (
                  <div className="margin-top-4">
                    <span className="semi-bold">Service: </span>
                    {respondent.serviceIndicator}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );

    return (
      <>
        <div className="subsection party-information">
          <div className="card">
            <div className="content-wrapper">
              <div className="grid-row header-row">
                <div className="grid-col-6 display-flex" id="secondary-label">
                  <h3>Respondent Counsel</h3>
                  {caseInformationHelper.showEditIrsPractitioners && (
                    <Button
                      link
                      className="margin-left-205 padding-0 height-3"
                      id="edit-irsPractitioners-button"
                    >
                      <FontAwesomeIcon icon="edit" size="sm" />
                      Edit
                    </Button>
                  )}
                </div>
                {caseInformationHelper.showAddCounsel && <RespondentSearch />}
              </div>
              {caseDetailHelper.hasIrsPractitioners &&
                respondentPartyInformation()}

              {!caseDetailHelper.hasIrsPractitioners && (
                <span>
                  There is no respondent counsel associated with this case.
                </span>
              )}
            </div>
          </div>
        </div>

        {showModal === 'AddIrsPractitionerModal' && <AddIrsPractitionerModal />}
        {showModal === 'RespondentExistsModal' && <RespondentExistsModal />}
      </>
    );
  },
);

export { RespondentInformation };
