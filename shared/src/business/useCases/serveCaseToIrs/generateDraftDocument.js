const {
  replaceBracketed,
} = require('../../../business/utilities/replaceBracketed');

const generateDraftDocument = async ({
  applicationContext,
  caseEntity,
  document,
  replacements,
}) => {
  const content = replaceBracketed(document.content, ...replacements);

  await applicationContext
    .getUseCaseHelpers()
    .addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: {
        ...document,
        content,
      },
    });
};

module.exports = {
  generateDraftDocument,
};
