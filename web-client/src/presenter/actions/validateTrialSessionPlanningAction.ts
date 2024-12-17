import { state } from '@web-client/presenter/app.cerebral';

export const validateTrialSessionPlanningAction = ({
  get,
  path,
  props,
}: ActionProps<{ term: string; year: number }>) => {
  const { term, year } = props;
  const validYears = get(state.modal.trialYears).map(validYear =>
    Number(validYear),
  );

  const termError: string | undefined = getTermError(term);
  const yearError: string | undefined = getYearError(Number(year), validYears);

  if (termError || yearError) {
    return path.error({
      errors: {
        term: termError,
        year: yearError,
      },
    });
  }

  return path.success();
};

function getTermError(term: string): string | undefined {
  if (!term) return 'Select a term';
  if (!['winter', 'fall', 'spring'].includes(term.toLocaleLowerCase()))
    return 'Select a valid term';
}

function getYearError(year: number, validYears: number[]): string | undefined {
  if (!year) return 'Select a year';
  if (!validYears.includes(year)) return 'Select a valid year';
}
