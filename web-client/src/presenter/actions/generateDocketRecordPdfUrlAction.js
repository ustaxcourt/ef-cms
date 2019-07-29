/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @returns {object}
 */
export const generateDocketRecordPdfUrlAction = async ({
  applicationContext,
  props,
}) => {
  const { docketNumber, docketRecordTemplate } = props;

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .createDocketRecordPdfInteractor({
      applicationContext,
      docketNumber,
      pdfFile: docketRecordTemplate,
    });

  const buf = new Buffer.from(docketRecordPdf, 'base64');
  const pdfFile = new Blob([buf], { type: 'application/pdf' });

  const pdfUrl = window.URL.createObjectURL(pdfFile);

  return { pdfUrl };
};
