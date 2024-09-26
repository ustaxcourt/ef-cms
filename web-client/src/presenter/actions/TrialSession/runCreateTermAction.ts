import { state } from '@web-client/presenter/app.cerebral';

export const runCreateTermAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const termResult = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termName,
      termStartDate,
    });

  let uint8array = new Uint8Array(termResult.data);

  const blob = new Blob([uint8array]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'funnestTermInTheBrowser.xlsx');

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);

  return {};
};
