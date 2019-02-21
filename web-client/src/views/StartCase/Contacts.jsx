import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  { startCaseHelper: state.startCaseHelper },
  function Contacts({ startCaseHelper }) {
    return (
      <React.Fragment>
        {(startCaseHelper.showPetitionerContact ||
          startCaseHelper.showDonorContact ||
          startCaseHelper.showCorporationContact ||
          startCaseHelper.showEstateWithoutExecutorContact ||
          startCaseHelper.showTransfereeContact) && <ContactPrimary />}
        {(startCaseHelper.showPetitionerAndSpouseContact ||
          startCaseHelper.showPetitionerAndDeceasedSpouseContact ||
          startCaseHelper.showEstateWithExecutorContact ||
          startCaseHelper.showConservatorContact ||
          startCaseHelper.showCustodianContact ||
          startCaseHelper.showGuardianContact ||
          startCaseHelper.showIncompetentPersonContact ||
          startCaseHelper.showMinorContact ||
          startCaseHelper.showPartnershipBBAContact ||
          startCaseHelper.showPartnershipOtherContact ||
          startCaseHelper.showPartnershipTaxMattersContact ||
          startCaseHelper.showSurvivingSpouseContact ||
          startCaseHelper.showTrustAndTrusteeContact) && (
          <React.Fragment>
            <ContactPrimary />
            <ContactSecondary />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  },
);
