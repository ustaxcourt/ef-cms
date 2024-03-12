import { state } from '@web-client/presenter/app.cerebral';

/**
 * navigates to the practitioner documents route
 * @returns {void}
 */

export const navigateToPractitionerDocumentsPageAction = async ({
  get,
  router,
}: ActionProps) => {
  const practitionerDetail = get(state.practitionerDetail);
  await router.route(
    `/practitioner-detail/${practitionerDetail.barNumber}?tab=practitioner-documentation`,
  );
};
