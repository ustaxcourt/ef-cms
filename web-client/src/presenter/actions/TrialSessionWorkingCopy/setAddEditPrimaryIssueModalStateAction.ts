import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setAddEditPrimaryIssueModalStateAction = ({
  props,
  store,
}: ActionProps) => {
  const { docketNumber, primaryIssue } = props.case;
  const petitioners = props.case.petitioners.map(p => p.entityName).join();
  const headingString = `Docket ${docketNumber}: ${petitioners}`;
  store.set(state.modal.heading, headingString);
  store.set(state.modal.notes, primaryIssue);
};
