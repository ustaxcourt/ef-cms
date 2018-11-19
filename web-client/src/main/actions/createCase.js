import { state } from 'cerebral';

export default async ({ useCases, applicationContext, get, props }) => {
  await useCases.createCase({
    applicationContext,
    documents: props.uploadResults,
    user: get(state.user),
  });
};
