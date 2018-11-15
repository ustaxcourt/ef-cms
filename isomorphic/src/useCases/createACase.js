const Case = require('../entities/Case');

module.exports = async ({ userId, documents, applicationContext }) => {
  const docketNumber = await applicationContext.docketNumberGenerator.createDocketNumber();
  const caseToCreate = new Case({
    userId: userId,
    docketNumber: docketNumber,
    documents: documents,
  });
  caseToCreate.validate();
  return applicationContext.persistence.create(caseToCreate);
};
