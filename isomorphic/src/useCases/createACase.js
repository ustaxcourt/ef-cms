const { createDocketNumber } = require('../persistence/docketNumberGenerator');
const casesPersistence = require('../persistence/awsDynamoPersistence');
const uuidv4 = require('uuid/v4');
const Case = require('../entities/Case');

module.exports = async ({
  userId,
  documents,
  persistence = casesPersistence,
}) => {
  const caseId = uuidv4();
  const docketNumber = await createDocketNumber();
  const caseToCreate = new Case({
    caseId: caseId,
    createdAt: new Date().toISOString(),
    userId: userId,
    docketNumber: docketNumber,
    documents: documents,
    status: 'new',
  });
  if (!caseToCreate.isValid()) {
    throw new Error('invalid case' + caseToCreate.getValidationError());
  }
  return persistence.create(caseToCreate);
};
