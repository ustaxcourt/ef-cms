const assert = require('assert');

const Document = require('./Document');
const WorkItem = require('./WorkItem');
const Message = require('./Message');

const A_VALID_DOCUMENT = {
  documentType: 'Petition',
  userId: 'taxpayer',
};

describe('Document entity', () => {
  describe('isValid', () => {
    it('Creates a valid document', () => {
      const myDoc = new Document(A_VALID_DOCUMENT);
      myDoc.documentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
      assert.ok(myDoc.isValid());
    });

    it('Creates an invalid document with no document type', () => {
      const myDoc = new Document({
        userId: '123',
      });
      assert.ok(!myDoc.isValid());
    });

    it('Creates an invalid document with no userId', () => {
      const myDoc = new Document({
        documentType: 'Petition',
      });
      assert.ok(!myDoc.isValid());
    });

    it('addWorkItem', () => {
      const myDoc = new Document(A_VALID_DOCUMENT);
      const workItem = new WorkItem({
        sentBy: 'bob',
        assigneeId: 'bob',
        docketNumber: '101-18',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        assigneeName: 'bob',
        caseTitle: 'testing',
        caseStatus: 'new',
        document: {},
      });
      const message = new Message({
        messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'hello world',
        userId: '123',
        sentBy: 'gg',
      });
      workItem.addMessage(message);
      myDoc.addWorkItem(new WorkItem({}));
      assert.ok(!myDoc.isValid());
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error = null;
      try {
        const document = new Document(A_VALID_DOCUMENT);
        document.documentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
        document.validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error === null);
    });

    it('should throw an error on invalid documents', () => {
      let error = null;
      try {
        new Document({}).validate();
      } catch (err) {
        error = err;
      }
      assert.ok(error !== null);
    });
  });
});
