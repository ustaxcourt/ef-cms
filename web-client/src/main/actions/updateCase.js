import { state } from 'cerebral';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  await useCases.updateCase({
    applicationContext,
    caseDetails: get(state.caseDetail),
    userToken: get(state.user.token),
  });
  //if all documents validated
  let validated = true;
  get(state.caseDetail).documents.forEach(document => {
    if (!document.validated) {
      validated = false;
    }
  });

  if (validated) {
    return path.success({
      alertSuccess: {
        title: 'Petition validated',
        message:
          'Case ' +
          get(state.caseDetail).docketNumber +
          ' status set to General Docket',
      },
    });
  } else {
    return path.error({
      alertError: {
        title: 'Validate all documents',
        message: 'Please validate all documents.',
      },
    });
  }
};
