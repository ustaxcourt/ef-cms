import { state } from 'cerebral';

export const getUser = async ({ api, path, get }) => {
  try {
    const user = api.getUser(get(state.form.name));
    return path.success({ user });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'User not found',
        message: 'Username or password are incorrect',
      },
    });
  }
};

export const setUser = async ({ store, props }) => {
  store.set(state.user, props.user);
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
        title: 'There was a problem',
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
        title: 'There was a problem',
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
        title: 'There was a problem',
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

export const clearLoginForm = ({ store }) => {
  store.set(state.form, {
    name: '',
  });
};

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
    uploadsFinished: 0,
  });
};

export const navigateToDashboard = ({ router }) => {
  router.route('/');
};
