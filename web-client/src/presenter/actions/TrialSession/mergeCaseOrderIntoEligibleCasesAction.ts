import { state } from '@web-client/presenter/app.cerebral';

/**
 * combines the caseOrder of the state.trailSession onto the state.trialSession.eligibleCases
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.calendaredCases
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const mergeCaseOrderIntoEligibleCasesAction = ({
  get,
  store,
}: ActionProps) => {
  const { caseOrder, eligibleCases } = get(state.trialSession);

  for (const eligibleCase of eligibleCases) {
    const order = caseOrder!.find(
      o => o.docketNumber === eligibleCase.docketNumber,
    );
    Object.assign(eligibleCase, order);
  }

  store.set(state.trialSession.eligibleCases, eligibleCases);
};
