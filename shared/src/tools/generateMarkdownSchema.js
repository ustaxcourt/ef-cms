const { Case } = require('../business/entities/cases/Case');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');

const entitiesDir = `${__dirname}/../../../docs/entities`;

Case.generateSchemaMarkdown(entitiesDir);
Document.generateSchemaMarkdown(entitiesDir);
DocketRecord.generateSchemaMarkdown(entitiesDir);
