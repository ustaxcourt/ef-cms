const joi = require('joi');
const {
  CHAMBERS_SECTIONS,
  IRS_SYSTEM_SECTION,
  SECTIONS,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CASE_STATUS_TYPES } = require('./EntityConstants');
const { CHIEF_JUDGE, ROLES } = require('./EntityConstants');
const { createISODateString } = require('../utilities/DateHandler');
const { omit } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawWorkItem the raw work item data
 * @constructor
 */
function WorkItem() {
  this.entityName = 'WorkItem';
}

WorkItem.prototype.init = function init(rawWorkItem, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.assigneeId = rawWorkItem.assigneeId;
  this.assigneeName = rawWorkItem.assigneeName;
  this.associatedJudge = rawWorkItem.associatedJudge || CHIEF_JUDGE;
  this.caseIsInProgress = rawWorkItem.caseIsInProgress;
  this.caseStatus = rawWorkItem.caseStatus;
  this.caseTitle = rawWorkItem.caseTitle;
  this.completedAt = rawWorkItem.completedAt;
  this.completedBy = rawWorkItem.completedBy;
  this.completedByUserId = rawWorkItem.completedByUserId;
  this.completedMessage = rawWorkItem.completedMessage;
  this.createdAt = rawWorkItem.createdAt || createISODateString();
  this.docketNumber = rawWorkItem.docketNumber;
  this.docketNumberWithSuffix = rawWorkItem.docketNumberWithSuffix;
  this.document = omit(rawWorkItem.document, 'workItem');
  this.hideFromPendingMessages = rawWorkItem.hideFromPendingMessages;
  this.highPriority = rawWorkItem.highPriority;
  this.inProgress = rawWorkItem.inProgress;
  this.isInitializeCase = rawWorkItem.isInitializeCase;
  this.isRead = rawWorkItem.isRead;
  this.section = rawWorkItem.section;
  this.sentBy = rawWorkItem.sentBy;
  this.sentBySection = rawWorkItem.sentBySection;
  this.sentByUserId = rawWorkItem.sentByUserId;
  this.trialDate = rawWorkItem.trialDate;
  this.updatedAt = rawWorkItem.updatedAt || createISODateString();
  this.workItemId = rawWorkItem.workItemId || applicationContext.getUniqueId();
};

WorkItem.validationName = 'WorkItem';

WorkItem.VALIDATION_RULES = joi.object().keys({
  assigneeId: JoiValidationConstants.UUID.allow(null).optional(),
  assigneeName: JoiValidationConstants.STRING.max(100).allow(null).optional(), // should be a Message entity at some point
  associatedJudge: JoiValidationConstants.STRING.max(100).required(),
  caseIsInProgress: joi.boolean().optional(),
  caseStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(CASE_STATUS_TYPES),
  ).optional(),
  caseTitle: JoiValidationConstants.STRING.max(500).optional(),
  completedAt: JoiValidationConstants.ISO_DATE.optional(),
  completedBy: JoiValidationConstants.STRING.max(100).optional().allow(null),
  completedByUserId: JoiValidationConstants.UUID.optional().allow(null),
  completedMessage: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null),
  createdAt: JoiValidationConstants.ISO_DATE.optional(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  document: joi.object().required(),
  entityName: JoiValidationConstants.STRING.valid('WorkItem').required(),
  hideFromPendingMessages: joi.boolean().optional(),
  highPriority: joi.boolean().optional(),
  inProgress: joi.boolean().optional(),
  isInitializeCase: joi.boolean().optional(),
  isRead: joi.boolean().optional(),
  section: JoiValidationConstants.STRING.valid(
    ...SECTIONS,
    ...CHAMBERS_SECTIONS,
    ...Object.values(ROLES),
    IRS_SYSTEM_SECTION,
  ).required(),
  sentBy: JoiValidationConstants.STRING.max(100)
    .required()
    .description('The name of the user that sent the WorkItem'),
  sentBySection: JoiValidationConstants.STRING.valid(
    ...SECTIONS,
    ...CHAMBERS_SECTIONS,
    ...Object.values(ROLES),
  ).optional(),
  sentByUserId: JoiValidationConstants.UUID.optional(),
  trialDate: JoiValidationConstants.ISO_DATE.optional().allow(null),
  updatedAt: JoiValidationConstants.ISO_DATE.required(),
  workItemId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(WorkItem, WorkItem.VALIDATION_RULES);

/**
 * Assign to a user
 *
 * @param {object} props the props object
 * @param {string} props.assigneeId the user id of the user to assign the work item to
 * @param {string} props.assigneeName the name of the user to assign the work item to
 * @param {string} props.role the role of the user to assign the work item to
 * @param {string} props.sentBy the name of the user who sent the work item
 * @param {string} props.sentByUserId the user id of the user who sent the work item
 * @param {string} props.sentByUserRole the role of the user who sent the work item
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.assignToUser = function ({
  assigneeId,
  assigneeName,
  section,
  sentBy,
  sentBySection,
  sentByUserId,
}) {
  Object.assign(this, {
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  });
  return this;
};

WorkItem.prototype.setStatus = function (status) {
  this.caseStatus = status;
};

/**
 *
 * @param {object} props the props object
 * @param {string} props.message the message the user entered when setting as completed
 * @param {object} props.user the user who triggered the complete action
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.setAsCompleted = function ({ message, user }) {
  this.completedAt = createISODateString();
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedMessage = message;
  delete this.inProgress;
  return this;
};

exports.WorkItem = validEntityDecorator(WorkItem);
