import { state } from 'cerebral';

export const getUser = ({ applicationContext, get, path }) => {
  try {
    const user = applicationContext
      .getPersistenceGateway()
      .getUser(get(state.form.name));
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

export const createPdfPetition = ({ get, applicationContext }) => {
  applicationContext
    .getPersistenceGateway()
    .createPdfPetition(
      applicationContext.getBaseUrl(),
      get(state.user),
      get(state.petition),
    );
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

export const clearLoginForm = ({ store }) => {
  store.set(state.form, {
    name: '',
  });
};

export const clearPetition = ({ store }) => {
  store.set(state.petition, {
    petitionFile: {
      file: undefined,
    },
    requestForPlaceOfTrial: {
      file: undefined,
    },
    statementOfTaxpayerIdentificationNumber: {
      file: undefined,
    },
    uploadsFinished: 0,
  });
};

export const navigateHome = ({ router }) => {
  router.route('/');
};
