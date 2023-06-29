import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the categoryName on the state.form based on the categoryType selected
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const computeCategoryNameAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const categoryType = get(state.form.categoryType);
  const location = get(state.form.location);

  const certificateOfGoodStandingType =
    applicationContext.getConstants().PRACTITIONER_DOCUMENT_TYPES_MAP
      .CERTIFICATE_OF_GOOD_STANDING;

  store.set(state.form.categoryName, categoryType);

  if (categoryType === certificateOfGoodStandingType) {
    store.set(
      state.form.categoryName,
      `${certificateOfGoodStandingType} - ${location}`,
    );
  }
};
