import { SESSION_TERMS_DICT } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const validateTrialSessionPlanningAction = ({
  get,
  path,
  props,
}: ActionProps<{ term: string; year: string }>) => {
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

const validTerms = [
  SESSION_TERMS_DICT.WINTER,
  SESSION_TERMS_DICT.FALL,
  SESSION_TERMS_DICT.SPRING,
].map(str => str.toLocaleLowerCase());

function getTermError(term: string): string | undefined {
  if (!term) return 'Select a term';
  if (!validTerms.includes(term)) return 'Select a valid term';
}

function getYearError(year: number, validYears: number[]): string | undefined {
  if (!year) return 'Select a year';
  if (!validYears.includes(year)) return 'Select a valid year';
}
