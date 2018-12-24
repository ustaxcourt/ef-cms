const Case = require('../../entities/Case');
const Message = require('../../entities/Message');
const WorkItem = require('../../entities/WorkItem');
const Document = require('../../entities/Document');

exports.getCaseEntityForUpload = ({
  user,
  documentType,
  caseToUpdate,
  documentId,
}) => {
  const caseEntity = new Case(caseToUpdate);
  const documentEntity = new Document({
    userId: user.userId,
    documentId,
    filedBy: user.name,
    documentType,
  });

  const workItem = new WorkItem({
    sentBy: user.userId,
    caseId: caseToUpdate.caseId,
    document: {
      documentId: documentEntity.documentId,
      documentType,
      createdAt: documentEntity.createdAt,
    },
    assigneeId: null,
    docketNumber: caseToUpdate.docketNumber,
    section: 'docket',
    assigneeName: null,
  });
  delete workItem.createdAt; // persistence layer won't save the workItem unless createdAt is null.... this is bad design
  const message = new Message({
    message: `a ${documentType} filed by ${user.role} is ready for review`,
    sentBy: user.name,
    userId: user.userId,
    createdAt: new Date().toISOString(),
  });
  workItem.addMessage(message);
  delete documentEntity.createdAt; // persistence layer won't save the document unless createdAt is null.... this is bad design
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);
  return caseEntity;
};
