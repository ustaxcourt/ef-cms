const fs = require('fs');
const { Case } = require('../business/entities/cases/Case');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');

const entitiesDir = `${__dirname}/../../../docs/entities`;

const schema = JSON.stringify(Case.getSchema().describe(), null, 2);

console.log('schema', schema);

fs.writeFileSync('schema.json', schema);
