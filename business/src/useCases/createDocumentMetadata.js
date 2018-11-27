const Document = require('../entities/Document');

module.exports = ({ document: rawDocument, applicationContext }) => {
  const documentToCreate = new Document({
    userId: rawDocument.userId,
    documentType: rawDocument.documentType,
  });
  documentToCreate.validate();
  return applicationContext.persistence.create({
    entity: documentToCreate,
    applicationContext,
  });
};
