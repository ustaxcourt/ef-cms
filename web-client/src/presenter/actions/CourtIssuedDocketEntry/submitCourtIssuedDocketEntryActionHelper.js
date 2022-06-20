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
  };

  await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketNumbers,
      documentMeta,
      subjectDocketNumber,
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
