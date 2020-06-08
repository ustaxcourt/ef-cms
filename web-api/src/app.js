const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

const {
  archiveDraftDocumentLambda,
} = require('./documents/archiveDraftDocumentLambda');
const {
  completeDocketEntryQCLambda,
} = require('./documents/completeDocketEntryQCLambda');
const {
  createCaseDeadlineLambda,
} = require('./caseDeadline/createCaseDeadlineLambda');
const {
  createCourtIssuedOrderPdfFromHtmlLambda,
} = require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda');
const {
  deleteCaseDeadlineLambda,
} = require('./caseDeadline/deleteCaseDeadlineLambda');
const {
  deleteCorrespondenceDocumentLambda,
} = require('./correspondence/deleteCorrespondenceDocumentLambda');
const {
  downloadPolicyUrlLambda,
} = require('./documents/downloadPolicyUrlLambda');
const {
  fileCorrespondenceDocumentLambda,
} = require('./correspondence/fileCorrespondenceDocumentLambda');
const {
  fileCourtIssuedDocketEntryLambda,
} = require('./documents/fileCourtIssuedDocketEntryLambda');
const {
  fileCourtIssuedOrderToCaseLambda,
} = require('./documents/fileCourtIssuedOrderToCaseLambda');
const {
  fileDocketEntryToCaseLambda,
} = require('./documents/fileDocketEntryToCaseLambda');
const {
  fileExternalDocumentToCaseLambda,
} = require('./documents/fileExternalDocumentToCaseLambda');
const {
  fileExternalDocumentToConsolidatedCasesLambda,
} = require('./documents/fileExternalDocumentToConsolidatedCasesLambda');
const {
  generateDocketRecordPdfLambda,
} = require('./cases/generateDocketRecordPdfLambda');
const {
  getAllCaseDeadlinesLambda,
} = require('./caseDeadline/getAllCaseDeadlinesLambda');
const {
  getCaseDeadlinesForCaseLambda,
} = require('./caseDeadline/getCaseDeadlinesForCaseLambda');
const {
  getDocumentDownloadUrlLambda,
} = require('./documents/getDocumentDownloadUrlLambda');
const {
  removeCasePendingItemLambda,
} = require('./cases/removeCasePendingItemLambda');
const {
  saveCaseDetailInternalEditLambda,
} = require('./cases/saveCaseDetailInternalEditLambda');
const {
  serveCourtIssuedDocumentLambda,
} = require('./cases/serveCourtIssuedDocumentLambda');
const {
  updateCaseDeadlineLambda,
} = require('./caseDeadline/updateCaseDeadlineLambda');
const {
  updateCorrespondenceDocumentLambda,
} = require('./correspondence/updateCorrespondenceDocumentLambda');
const {
  updateCourtIssuedDocketEntryLambda,
} = require('./documents/updateCourtIssuedDocketEntryLambda');
const {
  updateCourtIssuedOrderToCaseLambda,
} = require('./documents/updateCourtIssuedOrderToCaseLambda');
const {
  updateDocketEntryMetaLambda,
} = require('./documents/updateDocketEntryMetaLambda');
const {
  updateDocketEntryOnCaseLambda,
} = require('./documents/updateDocketEntryOnCaseLambda');
const { addCoversheetLambda } = require('./documents/addCoversheetLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { createWorkItemLambda } = require('./workitems/createWorkItemLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { signDocumentLambda } = require('./documents/signDocumentLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');

app.get('/api/swagger', async (req, res) => {
  const { body, headers } = await swaggerLambda();
  res.set(headers);
  res.send(body);
});

app.get('/api/swagger.json', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {};
  const response = await swaggerJsonLambda(event);
  res.json(JSON.parse(response.body));
});

app.get('/cases/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await getCaseLambda(event);
  res.json(JSON.parse(response.body));
});

app.get('/api/notifications', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await getNotificationsLambda(event);
  res.json(JSON.parse(response.body));
});

app.post('/api/court-issued-order', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await createCourtIssuedOrderPdfFromHtmlLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/cases/:caseId/', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await saveCaseDetailInternalEditLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post('/api/docket-record-pdf', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await generateDocketRecordPdfLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/cases/:caseId/remove-pending/:documentId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await removeCasePendingItemLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-deadlines/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await createCaseDeadlineLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post('/cases', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: req.params,
  };
  const response = await createCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.get('/case-deadlines/:caseId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await getCaseDeadlinesForCaseLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-deadlines/:caseId/:caseDeadlineId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseDeadlineId: req.params.caseDeadlineId,
      caseId: req.params.caseId,
    },
  };
  const response = await updateCaseDeadlineLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-deadlines/:caseId/:caseDeadlineId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseDeadlineId: req.params.caseDeadlineId,
      caseId: req.params.caseId,
    },
  };
  const response = await deleteCaseDeadlineLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.get('/case-deadlines', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
  };
  const response = await getAllCaseDeadlinesLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post(
  '/case-documents/:caseId/:documentId/serve-court-issued',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await serveCourtIssuedDocumentLambda({
      ...event,
    });
    res.json(JSON.parse(response.body));
  },
);

app.post('/case-documents/:caseId/:documentId/work-items', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      documentId: req.params.documentId,
    },
  };
  const response = await createWorkItemLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-documents/:caseId/:documentId/coversheet', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      documentId: req.params.documentId,
    },
  };
  const response = await addCoversheetLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-documents/:caseId/:documentId/sign', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      documentId: req.params.documentId,
    },
  };
  const response = await signDocumentLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-documents/:caseId/:documentId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      documentId: req.params.documentId,
    },
  };
  const response = await archiveDraftDocumentLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-documents/:caseId/external-document', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await fileExternalDocumentToCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post(
  '/case-documents/consolidated/:leadCaseId/external-document',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        leadCaseId: req.params.leadCaseId,
      },
    };
    const response = await fileExternalDocumentToConsolidatedCasesLambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  },
);

app.post('/case-documents/:caseId/docket-entry', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await fileDocketEntryToCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-documents/:caseId/docket-entry', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateDocketEntryOnCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-documents/:caseId/docket-entry-meta', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateDocketEntryMetaLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-documents/:caseId/docket-entry-complete', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await completeDocketEntryQCLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post(
  '/case-documents/:caseId/court-issued-docket-entry',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
      },
    };
    const response = await fileCourtIssuedDocketEntryLambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  },
);

app.put(
  '/case-documents/:caseId/court-issued-docket-entry',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
      },
    };
    const response = await updateCourtIssuedDocketEntryLambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  },
);

app.post('/case-documents/:caseId/court-issued-order', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await fileCourtIssuedOrderToCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put(
  '/case-documents/:caseId/court-issued-orders/:documentId',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await updateCourtIssuedOrderToCaseLambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  },
);

app.get(
  '/case-documents/:caseId/:documentId/download-policy-url',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await downloadPolicyUrlLambda({
      ...event,
    });
    res.json(JSON.parse(response.body));
  },
);

app.get(
  '/case-documents/:caseId/:documentId/document-download-url',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await getDocumentDownloadUrlLambda({
      ...event,
    });
    res.json(JSON.parse(response.body));
  },
);

app.post('/case-documents/:caseId/correspondence', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await fileCorrespondenceDocumentLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put(
  '/case-documents/:caseId/correspondence/:documentId',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await updateCorrespondenceDocumentLambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  },
);

app.delete(
  '/case-documents/:caseId/correspondence/:documentId',
  async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: {
        caseId: req.params.caseId,
        documentId: req.params.documentId,
      },
    };
    const response = await deleteCorrespondenceDocumentLambda({
      ...event,
    });
    res.json(JSON.parse(response.body));
  },
);

exports.app = app;
