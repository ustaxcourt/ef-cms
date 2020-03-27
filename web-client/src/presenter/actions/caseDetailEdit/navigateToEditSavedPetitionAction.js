import { state } from 'cerebral';

/**
 * changes the route to view the edit saved document detail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get cerebral get function
 * @param {object} providers.props cerebral props object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToEditSavedPetitionAction = async ({
  get,
  props,
  router,
}) => {
  const documentId = get(state.documentId);
  const docketNumber = get(state.form.docketNumber);
  const { tab } = props;

  if (documentId && docketNumber) {
    await router.route(
      `/case-detail/${docketNumber}/documents/${documentId}/edit-saved${
        tab ? `?tab=${tab}` : ''
      }`,
    );
  }
};
