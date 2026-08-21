/**
 * Formats a user-entered additional-order clause for insertion into generated
 * order HTML. Avoids doubling terminal punctuation when the clause already
 * ends with ., ?, or !.
 */
export const formatAdditionalOrderClauseForRichText = (
  text: string,
): string => {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (/[.!?]['"]?$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
};
