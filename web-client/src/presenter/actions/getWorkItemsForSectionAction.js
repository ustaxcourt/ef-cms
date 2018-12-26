import { state } from 'cerebral';

export default section => {
  return async ({ applicationContext, get, path }) => {
    const useCases = applicationContext.getUseCases();
    const userId = get(state.user.userId);
    let workItems = await useCases.getWorkItemsBySection({
      applicationContext,
      section,
      userId,
    });
    return path.success({ workItems });
  };
};
