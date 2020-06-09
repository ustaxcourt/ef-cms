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
  addConsolidatedCaseLambda,
} = require('./cases/addConsolidatedCaseLambda');
const {
  addDeficiencyStatisticLambda,
} = require('./cases/addDeficiencyStatisticLambda');
const {
  archiveDraftDocumentLambda,
} = require('./documents/archiveDraftDocumentLambda');
const {
  blockCaseFromTrialLambda,
} = require('./cases/blockCaseFromTrialLambda');
const {
  completeDocketEntryQCLambda,
} = require('./documents/completeDocketEntryQCLambda');
const {
  createCaseDeadlineLambda,
} = require('./caseDeadline/createCaseDeadlineLambda');
const {
  createCaseFromPaperLambda,
} = require('./cases/createCaseFromPaperLambda');
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
  deleteDeficiencyStatisticLambda,
} = require('./cases/deleteDeficiencyStatisticLambda');
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
  getOpenConsolidatedCasesLambda,
} = require('./cases/getOpenConsolidatedCasesLambda');
const { serveCaseToIrsLambda } = require('./cases/serveCaseToIrsLambda');

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
  getConsolidatedCasesByCaseLambda,
} = require('./cases/getConsolidatedCasesByCaseLambda');
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
  unblockCaseFromTrialLambda,
} = require('./cases/unblockCaseFromTrialLambda');
const {
  updateCaseDeadlineLambda,
} = require('./caseDeadline/updateCaseDeadlineLambda');
const {
  updateCaseTrialSortTagsLambda,
} = require('./cases/updateCaseTrialSortTagsLambda');
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
  updateDeficiencyStatisticLambda,
} = require('./cases/updateDeficiencyStatisticLambda');
const {
  updateDocketEntryMetaLambda,
} = require('./documents/updateDocketEntryMetaLambda');
const {
  updateDocketEntryOnCaseLambda,
} = require('./documents/updateDocketEntryOnCaseLambda');
const {
  updateOtherStatisticsLambda,
} = require('./cases/updateOtherStatisticsLambda');
const {
  updateQcCompleteForTrialLambda,
} = require('./cases/updateQcCompleteForTrialLambda');
const { addCoversheetLambda } = require('./documents/addCoversheetLambda');
const { caseAdvancedSearchLambda } = require('/cases/caseAdvancedSearchLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { createWorkItemLambda } = require('./workitems/createWorkItemLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getClosedCasesLambda } = require('./cases/getClosedCasesLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { prioritizeCaseLambda } = require('./cases/prioritizeCaseLambda');
const { sealCaseLambda } = require('./cases/sealCaseLambda');
const { signDocumentLambda } = require('./documents/signDocumentLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');
const { unprioritizeCaseLambda } = require('./cases/unprioritizeCaseLambda');
const { updateCaseContextLambda } = require('./cases/updateCaseContextLambda');

const lambdaWrapper = async lambda => {
  return async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: req.params,
      queryStringParameters: req.query,
    };
    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  };
};

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

app.put('/case-meta/:caseId/update-case-trial-sort-tags', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateCaseTrialSortTagsLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-meta/:caseId/block', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await blockCaseFromTrialLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-meta/:caseId/block', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await unblockCaseFromTrialLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-meta/:caseId/high-priority', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await prioritizeCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-meta/:caseId/high-priority', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await unprioritizeCaseLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-meta/:caseId/case-context', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateCaseContextLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-meta/:caseId/consolidate-case', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await addConsolidatedCaseLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-meta/:caseId/qc-complete', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateQcCompleteForTrialLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-meta/:caseId/seal', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await sealCaseLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-meta/:caseId/other-statistics', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await updateOtherStatisticsLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.post('/case-meta/:caseId/statistics', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
    },
  };
  const response = await addDeficiencyStatisticLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.put('/case-meta/:caseId/statistics/:statisticId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      statisticId: req.params.statisticId,
    },
  };
  const response = await updateDeficiencyStatisticLambda({
    ...event,
    body: JSON.stringify(req.body),
  });
  res.json(JSON.parse(response.body));
});

app.delete('/case-meta/:caseId/statistics/:statisticId', async (req, res) => {
  const event = (req.apiGateway && req.apiGateway.event) || {
    headers: req.headers,
    pathParameters: {
      caseId: req.params.caseId,
      statisticId: req.params.statisticId,
    },
  };
  const response = await deleteDeficiencyStatisticLambda({
    ...event,
  });
  res.json(JSON.parse(response.body));
});

app.post('/cases/paper', lambdaWrapper(createCaseFromPaperLambda));
app.get('/cases/open', lambdaWrapper(getOpenConsolidatedCasesLambda));
app.get('/cases/closed', lambdaWrapper(getClosedCasesLambda));
app.get('/cases/search', lambdaWrapper(caseAdvancedSearchLambda));
app.get(
  '/cases/:caseId/consolidated-cases',
  lambdaWrapper(getConsolidatedCasesByCaseLambda),
);
app.post('/cases/:caseId/serve-to-irs', lambdaWrapper(serveCaseToIrsLambda));

exports.app = app;
