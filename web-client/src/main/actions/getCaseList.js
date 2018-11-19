import { state } from 'cerebral';

export default async ({ useCases, applicationContext, get, path }) => {
  try {
    const caseList = await useCases.getCases(
      applicationContext,
      get(state.user.userId),
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
