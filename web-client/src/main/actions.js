import { state } from 'cerebral';

export const getUser = async ({ useCases, applicationContext, get, path }) => {
  try {
    const user = await useCases.getUser(
      applicationContext.getPersistenceGateway(),
      get(state.form.name),
    );
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
export const getCaseList = async ({
  useCases,
  applicationContext,
  get,
  path,
}) => {
  try {
    const caseList = await useCases.getCases(
      applicationContext,
      get(state.user.name),
    );
    return path.success({ caseList });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'Cases not found',
        message: 'No cases were retrieved',
      },
    });
  }
};

export const setCaseList = ({ store, props }) => {
  store.set(state.cases, props.caseList);
  return;
};

export const getCaseDetail = async ({
  useCases,
  applicationContext,
  get,
  props,
}) => {
  const caseDetail = await useCases.getCaseDetail(
    applicationContext,
    props.caseId,
    get(state.user.name),
  );
  return { caseDetail };
};

export const setCaseDetail = ({ store, props }) => {
  store.set(state.caseDetail, props.caseDetail);
  return;
};

export const setUser = ({ store, props }) => {
  store.set(state.user, props.user);
  return;
};

export const filePdfPetition = async ({
  useCases,
  applicationContext,
  get,
  store,
}) => {
  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };
  await useCases.filePdfPetition(
    applicationContext.getBaseUrl(),
    applicationContext.getPersistenceGateway(),
    get(state.petition),
    get(state.user),
    fileHasUploaded,
  );
};

export const getFilePdfPetitionAlertSuccess = () => {
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
    petitionFile: null,
    requestForPlaceOfTrial: null,
    statementOfTaxpayerIdentificationNumber: null,
    uploadsFinished: 0,
  });
};

export const navigateToDashboard = ({ router }) => {
  router.route('/');
};
