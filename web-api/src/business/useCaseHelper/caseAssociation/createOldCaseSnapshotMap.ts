/**
 * Creates a Map of deep-cloned raw case snapshots keyed by docket number.
 * Use this to capture the "old" state of cases before mutation, so the
 * snapshot can be passed as `oldCase` to `updateCaseAndAssociations`
 * to avoid a redundant database re-fetch.
 */
type RawCaseWithoutConsolidated = Omit<RawCase, 'consolidatedCases'>;

export function createOldCaseSnapshotMap(
  rawCases: RawCaseWithoutConsolidated[],
): Map<string, RawCaseWithoutConsolidated> {
  const snapshotMap = new Map<string, RawCaseWithoutConsolidated>();
  for (const rawCase of rawCases) {
    snapshotMap.set(rawCase.docketNumber, structuredClone(rawCase));
  }
  return snapshotMap;
}
