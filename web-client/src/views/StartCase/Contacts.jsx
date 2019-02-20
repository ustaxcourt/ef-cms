import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import ConservatorContact from './ConservatorContact';
import CorporationContact from './CorporationContact';
import CustodianContact from './CustodianContact';
import DonorContact from './DonorContact';
import EstateWithExecutorContact from './EstateWithExecutorContact';
import EstateWithoutExecutorContact from './EstateWithoutExecutorContact';
import GuardianContact from './GuardianContact';
import IncompetentPersonContact from './IncompetentPersonContact';
import MinorContact from './MinorContact';
import PartnershipBBAContact from './PartnershipBBAContact';
import PartnershipOtherContact from './PartnershipOtherContact';
import PartnershipTaxMattersContact from './PartnershipTaxMattersContact';
import PetitionerAndDeceasedSpouseContact from './PetitionerAndDeceasedSpouseContact';
import PetitionerAndSpouseContact from './PetitionerAndSpouseContact';
import PetitionerContact from './PetitionerContact';
import SurvivingSpouseContact from './SurvivingSpouseContact';
import TransfereeContact from './TransfereeContact';
import TrustAndTrusteeContact from './TrustAndTrusteeContact';

export default connect(
  { startCaseHelper: state.startCaseHelper },
  function Contacts({ startCaseHelper }) {
    return (
      <React.Fragment>
        {startCaseHelper.showPetitionerContact && <PetitionerContact />}
        {startCaseHelper.showPetitionerAndSpouseContact && (
          <PetitionerAndSpouseContact />
        )}
        {startCaseHelper.showPetitionerAndDeceasedSpouseContact && (
          <PetitionerAndDeceasedSpouseContact />
        )}
        {startCaseHelper.showEstateWithExecutorContact && (
          <EstateWithExecutorContact />
        )}
        {startCaseHelper.showEstateWithoutExecutorContact && (
          <EstateWithoutExecutorContact />
        )}
        {startCaseHelper.showTrustAndTrusteeContact && (
          <TrustAndTrusteeContact />
        )}
        {startCaseHelper.showCorporationContact && <CorporationContact />}
        {startCaseHelper.showPartnershipTaxMattersContact && (
          <PartnershipTaxMattersContact />
        )}
        {startCaseHelper.showPartnershipOtherContact && (
          <PartnershipOtherContact />
        )}
        {startCaseHelper.showPartnershipBBAContact && <PartnershipBBAContact />}
        {startCaseHelper.showConservatorContact && <ConservatorContact />}
        {startCaseHelper.showGuardianContact && <GuardianContact />}
        {startCaseHelper.showCustodianContact && <CustodianContact />}
        {startCaseHelper.showMinorContact && <MinorContact />}
        {startCaseHelper.showIncompetentPersonContact && (
          <IncompetentPersonContact />
        )}
        {startCaseHelper.showDonorContact && <DonorContact />}
        {startCaseHelper.showTransfereeContact && <TransfereeContact />}
        {startCaseHelper.showSurvivingSpouseContact && (
          <SurvivingSpouseContact />
        )}
      </React.Fragment>
    );
  },
);
