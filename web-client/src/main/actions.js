import { state } from 'cerebral';

export const getUser = async ({ api, path }) => {
  // TODO: use the api provider to query our fake API
  return path.success({ user });
};

export const setUser = async () => {
  // TODO: set the user name to the state
  return;
};

export const specifyPetitionFile = async () => {
  return { documentType: 'petitionFile' };
};

export const specifyRequestForPlaceOfTrial = async () => {
  return { documentType: 'requestForPlaceOfTrial' };
};

export const specifyStatementOfTaxpayerIdentificationNumber = async () => {
  return { documentType: 'statementOfTaxpayerIdentificationNumber' };
};

export const getDocumentPolicy = async ({ api, environment, store, path }) => {
  try {
    const response = await api.getDocumentPolicy(environment.getBaseUrl());
    store.set(state.petition.policy, response);
    return path.success();
  } catch (error) {
    return path.error({
      alertError: {
        title: 'There was a probem',
        message: 'Document policy retrieval failed',
      },
    });
  }
};

export const getDocumentId = async ({
  api,
  environment,
  store,
  path,
  get,
  props,
}) => {
  try {
    const response = await api.getDocumentId(
      environment.getBaseUrl(),
      get(state.user),
      get(props.documentType),
    );
    store.set(
      state.petition[get(props.documentType)].documentId,
      response.documentId,
    );
    return path.success();
  } catch (error) {
    return path.error({
      alertError: {
        title: 'There was a probem',
        message: 'Fetching document ID failed',
      },
    });
  }
};

export const uploadDocumentToS3 = async ({ api, get, path, props }) => {
  try {
    await api.uploadDocumentToS3(
      get(state.petition.policy),
      get(state.petition[get(props.documentType)].documentId),
      get(state.petition[get(props.documentType)].file),
    );
    return path.success();
  } catch (error) {
    return path.error({
      alertError: {
        title: 'There was a probem',
        message: 'Uploading document failed',
      },
    });
  }
};

export const getPetitionUploadAlertSuccess = () => {
  return {
    alertSuccess: {
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    },
  };
};

export const setFormSubmitting = ({ store }) => {
  store.set(state.submitting, true);
};

export const unsetFormSubmitting = ({ store }) => {
  store.set(state.submitting, false);
};

export const setAlertError = ({ props, store }) => {
  store.set(state.alertError, props.alertError);
};

export const setAlertSuccess = ({ props, store }) => {
  store.set(state.alertSuccess, props.alertSuccess);
};

// export const clearAlertError = ({ store }) => {
//   store.set(state.alertError, {});
// };

// export const clearAlertSuccess = ({ store }) => {
//   store.set(state.alertSuccess, {});
// };

export const clearPetition = ({ store }) => {
  store.set(state.petition, {
    petitionFile: {
      file: undefined,
      documentId: undefined,
    },
    requestForPlaceOfTrial: {
      file: undefined,
      documentId: undefined,
    },
    statementOfTaxpayerIdentificationNumber: {
      file: undefined,
      documentId: undefined,
    },
  });
};

export const navigateHome = ({ router }) => {
  router.route('/');
};
