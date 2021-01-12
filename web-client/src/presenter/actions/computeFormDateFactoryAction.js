import { state } from 'cerebral';

export const computeFormDateFactoryAction = (prefix, toIsoString) => {
  const computeFormDateAction = ({ applicationContext, get }) => {
    let formYear;
    let formMonth;
    let formDay;
    let computedDate = null;

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

    if (
      toIsoString &&
      applicationContext.getUtilities().isValidDateString(computedDate)
    ) {
      computedDate = applicationContext
        .getUtilities()
        .createISODateStringFromObject({
          day: formDay,
          month: formMonth,
          year: formYear,
        });
    }

    return { computedDate };
  };

  return computeFormDateAction;
};
