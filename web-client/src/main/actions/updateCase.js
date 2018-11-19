import { state } from 'cerebral';

export default async ({ useCases, applicationContext, get, path }) => {
  await useCases.updateCase(
    applicationContext.getBaseUrl(),
    applicationContext.getPersistenceGateway(),
    get(state.caseDetail),
    get(state.user),
  );
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
