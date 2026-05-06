// Reads two signals so this action covers both entry points without bespoke
// branching: the post-submit path returns `generateCoversheet` from the
// submit action; the post-serve socket path emits
// `coversheetPendingForDocketEntryId`. Either indicates the backend has
// already enqueued the coversheet and the UI should poll for completion.
export const isCoversheetNeededAction = ({ path, props }: ActionProps) => {
  const { coversheetPendingForDocketEntryId, generateCoversheet } = props;

  if (generateCoversheet || coversheetPendingForDocketEntryId) {
    return path.yes({
      docketEntryId: props.docketEntryId || coversheetPendingForDocketEntryId,
    });
  }

  return path.no();
};
