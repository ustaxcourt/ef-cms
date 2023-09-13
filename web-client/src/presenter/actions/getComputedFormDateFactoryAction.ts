import { state } from '@web-client/presenter/app.cerebral';

export const getComputedFormDateFactoryAction = (
  prefix: string | undefined,
  stateKey = 'computedDate',
) => {
  const computeFormDateAction = ({ applicationContext, get }: ActionProps) => {
    let formYear;
    let formMonth;
    let formDay;
    let computedDate;

    if (prefix) {
      formYear = get(state.form[`${prefix}Year`]);
      formMonth = get(state.form[`${prefix}Month`]);
      formDay = get(state.form[`${prefix}Day`]);
    } else {
      formYear = get(state.form.year);
      formMonth = get(state.form.month);
      formDay = get(state.form.day);
    }

    computedDate = applicationContext.getUtilities().computeDate({
      day: formDay,
      month: formMonth,
      year: formYear,
    });

    return { [stateKey]: computedDate };
  };

  return computeFormDateAction;
};
