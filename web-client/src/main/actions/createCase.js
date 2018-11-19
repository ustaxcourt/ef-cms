import { state } from 'cerebral';

export default async ({ applicationContext, get, props }) => {
  const useCases = applicationContext.getUseCases();
  await useCases.createCase({
    applicationContext,
    documents: props.uploadResults,
    user: get(state.user),
  });
};
