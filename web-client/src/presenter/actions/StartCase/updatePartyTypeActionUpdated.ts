import { state } from '@web-client/presenter/app.cerebral';

export const updatePartyTypeActionUpdated = ({
  applicationContext,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const { PARTY_TYPES } = applicationContext.getConstants();

  const resetFormFields = () => {
    store.unset(state.form.corporateDisclosureFile);
    store.unset(state.form.corporateDisclosureFileSize);
    store.unset(state.form.businessType);
    store.unset(state.form.otherType);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.estateType);
    store.unset(state.form.minorIncompetentType);
    store.unset(state.form.hasSpouseConsent);
  };

  const updatePartyType = (newPartyType: string) => {
    store.set(state.form.partyType, newPartyType);
  };

  const handleFilingType = () => {
    if (props.value === 'Myself' || props.value === 'Individual petitioner') {
      updatePartyType(PARTY_TYPES.petitioner);
    }
    resetFormFields();
  };

  const handleIsSpouseDeceased = () => {
    switch (props.value) {
      case 'Yes':
        updatePartyType(PARTY_TYPES.petitionerDeceasedSpouse);
        break;
      case 'No':
        updatePartyType(PARTY_TYPES.petitionerSpouse);
        break;
    }
  };

  const handleOtherType = () => {
    store.unset(state.form.estateType);
    store.unset(state.form.minorIncompetentType);
    store.unset(state.form.partyType);

    store.set(state.form.otherType, props.value);

    if (props.value === 'Deceased Spouse') {
      updatePartyType(PARTY_TYPES.survivingSpouse);
      return;
    }

    if (props.value === 'Donor' || props.value === 'Transferee') {
      updatePartyType(props.value);
    }
  };

  const handleEstateType = () => {
    updatePartyType(props.value);
  };

  const handleMinorIncompetentType = () => {
    updatePartyType(props.value);
  };

  const handleBusinessType = () => {
    updatePartyType(props.value);
  };

  switch (props.key) {
    case 'filingType':
      handleFilingType();
      break;
    case 'isSpouseDeceased':
      handleIsSpouseDeceased();
      break;
    case 'otherType':
      handleOtherType();
      break;
    case 'businessType':
      handleBusinessType();
      break;
    case 'estateType':
      handleEstateType();
      break;
    case 'minorIncompetentType':
      handleMinorIncompetentType();
      break;
  }
};
