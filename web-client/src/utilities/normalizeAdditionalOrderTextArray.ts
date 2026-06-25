/**
 * Drops entries that are empty or contain only whitespace (after trim).
 * Preserves meaningful text exactly as entered (does not trim substantive content).
 */
export function normalizeAdditionalOrderTextArray(
  additionalOrderTextArray?: string[] | null,
): string[] {
  if (!additionalOrderTextArray?.length) {
    return [];
  }
  return additionalOrderTextArray.filter(
    text => (text ?? '').trim().length > 0,
  );
}

/**
 * The first additional-order text control is always shown; optional rows are only
 * for extra clauses. When there is no substantive text in any row, the form still
 * contains one empty string for that first control.
 */
export function additionalOrderTextArrayWithRequiredFirstField(
  meaningfulEntries: string[],
): string[] {
  return meaningfulEntries.length > 0 ? meaningfulEntries : [''];
}
