import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditPrimaryIssueModalStateAction = ({
  props,
  store,
}: ActionProps<{
  case: { docketNumber: string; primaryIssue: string; petitioners: any[] };
}>) => {
  const { docketNumber, primaryIssue } = props.case;

  const petitioners = props.case.petitioners.map(p => p.entityName).join();

  const headingString = `Docket ${docketNumber}: ${petitioners}`;

  store.set(state.modal.docketNumber, props.case.docketNumber);
  store.set(state.modal.heading, headingString);
  store.set(state.modal.primaryIssue, primaryIssue);
};
