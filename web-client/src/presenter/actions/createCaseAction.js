import { state } from 'cerebral';
import { omit } from 'lodash';

export default async ({ applicationContext, get, store, path }) => {
  try {
    const { petitionFile } = get(state.petition);
    const useCases = applicationContext.getUseCases();

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

    await useCases.filePetition({
      applicationContext,
      petitionMetadata: form,
      petitionFile,
      fileHasUploaded,
    });

    return path.success();
  } catch (err) {
    return path.error({
      alertError: {
        title: 'An server error has occured trying to create the case',
        message: err.message,
      },
    });
  }
};
