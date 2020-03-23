exports.generatePdfReportInteractor = async ({
  applicationContext,
  contentHtml,
  documentIdPrefix = 'document',
}) => {
  let result = null;

  try {
    result = await applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor({
        applicationContext,
        contentHtml,
        footerHtml: `
        <div style="font-size:8px !important; color:#000; text-align:center; width:100%; margin-bottom:5px;">Printed <span class="date"></span></div>
      `,
        headerHtml: `
          <div style="font-size: 8px; font-family: sans-serif; float: right;">
            Page <span class="pageNumber"></span>
            of <span class="totalPages"></span>
          </div>
      `,
        overwriteFooter: true,
        overwriteHeader: true,
      });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  const documentId = `${documentIdPrefix}-${applicationContext.getUniqueId()}.pdf`;

  await new Promise(resolve => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: result,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: documentId,
    };

    s3Client.upload(params, function () {
      resolve();
    });
  });

  return documentId;
};
