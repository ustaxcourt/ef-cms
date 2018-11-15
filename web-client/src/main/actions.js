import { state } from 'cerebral';

export const getUser = async ({ useCases, applicationContext, get, path }) => {
  const user = await useCases.getUser(
    applicationContext.getPersistenceGateway(),
    get(state.form.name),
  );
  if (user) return path.success({ user });
  return path.error({
    alertError: {
      title: 'User not found',
      message: 'Username or password are incorrect',
    },
  });
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
        message: 'There was a problem getting the cases',
      },
    });
  }
};

export const setCaseList = ({ store, props }) => {
  store.set(state.cases, props.caseList);
  return;
};

export const setBaseUrl = ({ store, applicationContext }) => {
  store.set(state.baseUrl, applicationContext.getBaseUrl());
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
};

export const toggleDocumentValidation = ({ props, store, get }) => {
  const { item } = props;
  const indexToReplace = get(state.caseDetail.documents).findIndex(
    d => d.documentId === item.documentId,
  );
  store.merge(state.caseDetail.documents[indexToReplace], {
    validated: !item.validated,
  });
};

export const updateCase = async ({ useCases, applicationContext, get }) => {
  await useCases.updateCase(
    applicationContext.getBaseUrl(),
    applicationContext.getPersistenceGateway(),
    get(state.caseDetail),
    get(state.user),
  );
};

export const uploadCasePdfs = async ({
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
  const uploadResults = await useCases.uploadCasePdfs(
    applicationContext.getBaseUrl(),
    applicationContext.getPersistenceGateway(),
    get(state.petition),
    get(state.user),
    fileHasUploaded,
  );
  return { uploadResults };
};

export const createCase = ({ useCases, applicationContext, get, props }) => {
  const { uploadResults } = props;
  const documents = [
    {
      documentId: uploadResults.petitionFileId,
      documentType: 'petitionFile',
    },
    {
      documentId: uploadResults.requestForPlaceOfTrialId,
      documentType: 'requestForPlaceOfTrial',
    },
    {
      documentId: uploadResults.statementOfTaxpayerIdentificationNumberId,
      documentType: 'statementOfTaxpayerIdentificationNumber',
    },
  ];
  return useCases.createACaseProxy({
    userId: get(state.user).name,
    documents,
    applicationContext,
  });
};

export const getCreateCaseAlertSuccess = () => {
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

export const clearAlertError = ({ store }) => {
  store.set(state.alertError, null);
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

export const getUserRole = ({ get, path }) => {
  const user = get(state.user);
  return path[user.role]();
};

export const getPetitionsClerkCaseList = async ({
  useCases,
  applicationContext,
  get,
  path,
}) => {
  try {
    const caseList = await useCases.getPetitionsClerkCaseList(
      applicationContext,
      get(state.user.name),
    );
    return path.success({ caseList });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'Cases not found',
        message: 'There was a problem getting the cases',
      },
    });
  }
};

export const setPetitionsClerkCaseList = ({ store, props }) => {
  store.set(state.cases, props.caseList);
};
