// Single source of truth for "should we wait for a coversheet": the
// backend interactor sets `pendingCoversheetDocketEntryIds` on its
// response (or websocket payload) iff it actually enqueued one or more
// workers. The action forwards the IDs so the next step (the poll) can
// observe completion without re-deriving the gate from event-code rules.
export const isCoversheetNeededAction = ({ path, props }: ActionProps) => {
  const { pendingCoversheetDocketEntryIds } = props;

  if (
    pendingCoversheetDocketEntryIds &&
    pendingCoversheetDocketEntryIds.length > 0
  ) {
    // Existing call sites also relied on a single docketEntryId on props
    // (websocket payloads include one alongside the pending list); fall
    // back to the first pending ID when props.docketEntryId is absent.
    return path.yes({
      docketEntryIds: pendingCoversheetDocketEntryIds,
      docketEntryId:
        props.docketEntryId || pendingCoversheetDocketEntryIds[0],
    });
  }

  return path.no();
};
