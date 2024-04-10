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

  const clearUnusedFormFields = () => {
    if (
      props.value === 'A business' ||
      props.value === 'Other' ||
      props.value === 'Myself and my spouse' ||
      props.value === 'Petitioner and spouse'
    ) {
      store.unset(state.form.partyType);
    }

    if (props.value !== 'A business') {
      store.unset(state.form.corporateDisclosureFile);
      store.unset(state.form.businessType);
    }
    store.unset(state.form.otherType);
    store.unset(state.form.isSpouseDeceased);
    store.unset(state.form.estateType);
    store.unset(state.form.minorIncompetentType);
  };

  const updatePartyType = (newPartyType: string) => {
    store.set(state.form.partyType, newPartyType);
  };

  const handleFilingType = () => {
    const { value } = props;
    if (value === 'Myself' || value === 'Individual petitioner') {
      updatePartyType(PARTY_TYPES.petitioner);
    }
    clearUnusedFormFields();
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
    const { value } = props;
    store.set(state.form.otherType, value);

    switch (value) {
      case PARTY_TYPES.donor:
      case PARTY_TYPES.transferee:
        updatePartyType(value);
        break;
      case 'Deceased Spouse':
        updatePartyType(PARTY_TYPES.survivingSpouse);
        break;
      default:
        store.unset(state.form.partyType);
        break;
    }
  };

  const handleEstateType = () => {
    store.set(state.form.otherType, 'An estate or trust');
    updatePartyType(props.value);
  };

  const handleMinorIncompetentType = () => {
    store.set(state.form.otherType, 'A minor or legally incompetent person');
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
      updatePartyType(props.value);
      break;
    case 'estateType':
      handleEstateType();
      break;
    case 'minorIncompetentType':
      handleMinorIncompetentType();
      break;
  }
};
