import { state } from 'cerebral';
import { omit } from 'lodash';

export default async ({ applicationContext, get, store }) => {
  const { petitionFile } = get(state.petition);

  const fileHasUploaded = () => {
    store.set(
      state.petition.uploadsFinished,
      get(state.petition.uploadsFinished) + 1,
    );
  };

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${get(state.form.year)}-${get(state.form.month)}-${get(
        state.form.day,
      )}`,
    },
    ['year', 'month', 'day', 'trialCities', 'signature'],
  );

  await applicationContext.getUseCases().filePetition({
    applicationContext,
    petitionMetadata: form,
    petitionFile,
    fileHasUploaded,
  });
};
