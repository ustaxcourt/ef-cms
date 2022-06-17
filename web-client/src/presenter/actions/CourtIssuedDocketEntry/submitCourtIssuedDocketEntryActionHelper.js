export const submitCourtIssuedDocketEntryActionHelper = async ({
  applicationContext,
  docketEntryId,
  form,
  getDocketNumbers,
  subjectDocketNumber,
}) => {
  const docketNumbers = getDocketNumbers();

  const { COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET } =
    applicationContext.getConstants();

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumbers,
    subjectDocketNumber,
  };

  await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      documentMeta,
    });

  if (
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      documentMeta.eventCode,
    )
  ) {
    await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber: subjectDocketNumber,
      });
  }
};
