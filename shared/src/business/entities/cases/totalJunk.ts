import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { createValidationIdentifier } from '@shared/business/entities/cases/createValidationIdentifier';
import joi from 'joi';

const trialSession = new TrialSession({});
const rules = trialSession.getValidationRules();
const schema = joi.object().keys(rules);
const schemaDesc = schema.describe();
const schemaHash = createValidationIdentifier(schemaDesc);
const hash = createValidationIdentifier(rules);

// console.log(rules);
console.log('rules hash: ', hash);
console.log('schema hash: ', schemaHash);
