import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPrivatePractitionersModal } from './EditPrivatePractitionersModal';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  {
    addressDisplayHelper: state.addressDisplayHelper,
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddPrivatePractitionerModalSequence:
      sequences.openAddPrivatePractitionerModalSequence,
    openEditPrivatePractitionersModalSequence:
      sequences.openEditPrivatePractitionersModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    toggleShowAdditionalPetitionersSequence:
      sequences.toggleShowAdditionalPetitionersSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function PartiesInformation() {
    // {
    // addressDisplayHelper,
    // caseDetailHelper,
    // caseInformationHelper,
    // form,
    // formattedCaseDetail,
    // openAddPrivatePractitionerModalSequence,
    // openEditPrivatePractitionersModalSequence,
    // screenMetadata,
    // showModal,
    // toggleShowAdditionalPetitionersSequence,
    // updateFormValueSequence,
    // validationErrors,
    // },
    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="border border-base-lighter document-viewer--documents document-viewer--documents-list-container">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div className="document-viewer--documents-list">
                {/* <Button
                          className={classNames(
                            'usa-button--unstyled attachment-viewer-button',
                            viewDocumentId === entry.docketEntryId && 'active',
                          )}
                          isActive={viewDocumentId === entry.docketEntryId}
                          key={entry.docketEntryId}
                          onClick={() => {
                            setViewerDocumentToDisplaySequence({
                              viewerDocumentToDisplay: entry,
                            });
                          }}
                        >
              Petitioner(s) & Counsel
              Intervenor/Participants & Counsel
              Respondent Counsel
              </div> */}
              </div>
            </div>

            <div className="grid-col-8">some content</div>
          </div>
          {/* <div className="grid-row grid-gap-6"> */}
        </div>
      </>
    );
  },
);

export { PartiesInformation };
