import { state } from 'cerebral';

export default async ({ applicationContext, get, path, action }) => {
  const useCases = applicationContext.getUseCases();
  try {
    //TODO get specific usecase for workitem from app ctx .getWorkItemUseCaseByAction()
    const workItem = await useCases.updateWorkItem({
      applicationContext,
      workItemToUpdate: get(state.workItem),
      userId: get(state.user.token),
    });

    return path.success({
      workItem,
      alertSuccess: {
        title: 'Success',
        message: `Work item ${action}.`,
      },
    });
  } catch (error) {
    return path.error({
      alertError: {
        title: 'Error',
        message: error.response.data,
      },
    });
  }
};
