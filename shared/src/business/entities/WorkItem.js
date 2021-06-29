const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CASE_STATUS_TYPES, CHIEF_JUDGE } = require('./EntityConstants');
const { createISODateString } = require('../utilities/DateHandler');
const { pick } = require('lodash');
const { WORK_ITEM_VALIDATION_RULES } = require('./EntityValidationConstants');

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
  this.docketEntry = pick(rawWorkItem.docketEntry, [
    'additionalInfo',
    'createdAt',
    'descriptionDisplay',
    'docketEntryId',
    'documentTitle',
    'documentType',
    'eventCode',
    'filedBy',
    'index',
    'isFileAttached',
    'isPaper',
    'otherFilingParty',
    'receivedAt',
    'sentBy',
    'servedAt',
    'userId',
  ]);
  this.docketNumber = rawWorkItem.docketNumber;
  this.docketNumberWithSuffix = rawWorkItem.docketNumberWithSuffix;
  this.hideFromPendingMessages = rawWorkItem.hideFromPendingMessages;
  this.highPriority =
    rawWorkItem.highPriority ||
    rawWorkItem.caseStatus === CASE_STATUS_TYPES.calendared;
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

joiValidationDecorator(WorkItem, WORK_ITEM_VALIDATION_RULES);

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

WorkItem.prototype.setStatus = function (caseStatus) {
  this.caseStatus = caseStatus;
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

/**
 * marks the work item as read
 *
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.markAsRead = function () {
  this.isRead = true;
  return this;
};

exports.WorkItem = validEntityDecorator(WorkItem);
