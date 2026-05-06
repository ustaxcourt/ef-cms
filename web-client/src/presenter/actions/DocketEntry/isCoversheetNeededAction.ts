// Single source of truth for "should we wait for a coversheet": the
// backend interactor sets `coversheetPendingForDocketEntryId` on its
// response (or websocket payload) iff it actually enqueued the worker.
// The action forwards the docketEntryId so the next step (the poll) can
// observe completion without re-deriving the gate from event-code rules.
export const isCoversheetNeededAction = ({ path, props }: ActionProps) => {
  const { coversheetPendingForDocketEntryId } = props;

  if (coversheetPendingForDocketEntryId) {
    return path.yes({
      docketEntryId: props.docketEntryId || coversheetPendingForDocketEntryId,
    });
  }

  return path.no();
};
