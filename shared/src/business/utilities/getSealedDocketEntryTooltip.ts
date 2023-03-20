export const getSealedDocketEntryTooltip = (applicationContext, entry) => {
  const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

  return entry.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC
    ? 'Sealed to the public'
    : 'Sealed to the public and parties of this case';
};
