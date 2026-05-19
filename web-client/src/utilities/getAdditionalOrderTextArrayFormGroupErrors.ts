type ValidationErrorsLike = {
  additionalOrderTextArray?: string;
  [key: string]: string | undefined;
};

/**
 * JoiValidationEntity surfaces per-array-item errors as `additionalOrderTextArray-0`, etc.
 * Aggregate those plus any array-level message for FormGroup's string[] errorText.
 */
export const getAdditionalOrderTextArrayFormGroupErrors = (
  validationErrors: ValidationErrorsLike,
  clauseCount: number,
): string[] => {
  const messages: string[] = [];
  const arrayLevelMessage = validationErrors.additionalOrderTextArray;
  if (arrayLevelMessage) {
    messages.push(arrayLevelMessage);
  }
  for (let i = 0; i < clauseCount; i++) {
    const indexedMessage = validationErrors[`additionalOrderTextArray-${i}`];
    if (indexedMessage) {
      messages.push(indexedMessage);
    }
  }
  return messages;
};
