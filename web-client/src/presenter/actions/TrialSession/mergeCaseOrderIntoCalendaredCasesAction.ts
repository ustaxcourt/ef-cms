import { state } from '@web-client/presenter/app.cerebral';

/**
 * combines the caseOrder of the state.trailSession onto the state.trialSession.calendaredCases
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.calendaredCases
 * @param {object} providers.store the cerebral store used for setting the state.calendaredCases
 */
export const mergeCaseOrderIntoCalendaredCasesAction = ({
  get,
  store,
}: ActionProps) => {
  const { calendaredCases, caseOrder } = get(state.trialSession);

  for (const calendaredCase of calendaredCases) {
    const order = caseOrder!.find(
      o => o.docketNumber === calendaredCase.docketNumber,
    );
    Object.assign(calendaredCase, order);
  }

  store.set(state.trialSession.calendaredCases, calendaredCases);
};
