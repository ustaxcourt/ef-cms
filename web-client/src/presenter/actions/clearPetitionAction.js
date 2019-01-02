import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.petition, {
    petitionFile: null,
    requestForPlaceOfTrial: null,
    statementOfTaxpayerIdentificationNumber: null,
    uploadsFinished: 0,
  });
};
