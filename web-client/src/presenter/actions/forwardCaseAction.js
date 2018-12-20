import moment from 'moment';

export default async ({ path }) => {
  const forwardSendDate = new Date().toISOString();

  // const useCases = applicationContext.getUseCases();
  // const forwardSendDate = await useCases.forwardCaseSomething({
  //   documentId: get(state.caseDetail).documentId,
  //   userId: get(state.user.token),
  //   applicationContext,
  // });
  return path.success({
    alertSuccess: {
      title: 'Message successfully sent.',
      message: moment(forwardSendDate).format('L LT'),
    },
  });
};
