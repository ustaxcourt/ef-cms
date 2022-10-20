# DevEfCms.DefaultApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiCasesDocketNumberGenerateDocketRecordOptions**](DefaultApi.md#apiCasesDocketNumberGenerateDocketRecordOptions) | **OPTIONS** /api/cases/{docketNumber}/generate-docket-record | 
[**apiCasesDocketNumberGenerateDocketRecordPost**](DefaultApi.md#apiCasesDocketNumberGenerateDocketRecordPost) | **POST** /api/cases/{docketNumber}/generate-docket-record | create a pdf of the docket record for a case
[**apiCourtIssuedOrderOptions**](DefaultApi.md#apiCourtIssuedOrderOptions) | **OPTIONS** /api/court-issued-order | 
[**apiCourtIssuedOrderPost**](DefaultApi.md#apiCourtIssuedOrderPost) | **POST** /api/court-issued-order | create a court issued order pdf preview
[**apiDocketRecordPdfOptions**](DefaultApi.md#apiDocketRecordPdfOptions) | **OPTIONS** /api/docket-record-pdf | 
[**apiDocketRecordPdfPost**](DefaultApi.md#apiDocketRecordPdfPost) | **POST** /api/docket-record-pdf | create a pdf of the docket record for a case
[**apiNotificationsOptions**](DefaultApi.md#apiNotificationsOptions) | **OPTIONS** /api/notifications | 
[**apiRunBatchProcessPost**](DefaultApi.md#apiRunBatchProcessPost) | **POST** /api/run-batch-process | run IRS batch process
[**apiSwaggerGet**](DefaultApi.md#apiSwaggerGet) | **GET** /api/swagger | 
[**apiSwaggerJsonGet**](DefaultApi.md#apiSwaggerJsonGet) | **GET** /api/swagger.json | 
[**apiSwaggerJsonOptions**](DefaultApi.md#apiSwaggerJsonOptions) | **OPTIONS** /api/swagger.json | 
[**apiSwaggerOptions**](DefaultApi.md#apiSwaggerOptions) | **OPTIONS** /api/swagger | 
[**asyncUsersVerifyEmailOptions**](DefaultApi.md#asyncUsersVerifyEmailOptions) | **OPTIONS** /async/users/verify-email | 
[**authLoginOptions**](DefaultApi.md#authLoginOptions) | **OPTIONS** /auth/login | 
[**authRefreshOptions**](DefaultApi.md#authRefreshOptions) | **OPTIONS** /auth/refresh | 
[**caseDeadlinesDocketNumberCaseDeadlineIdOptions**](DefaultApi.md#caseDeadlinesDocketNumberCaseDeadlineIdOptions) | **OPTIONS** /case-deadlines/{docketNumber}/{caseDeadlineId} | 
[**caseDeadlinesDocketNumberOptions**](DefaultApi.md#caseDeadlinesDocketNumberOptions) | **OPTIONS** /case-deadlines/{docketNumber} | 
[**caseDeadlinesOptions**](DefaultApi.md#caseDeadlinesOptions) | **OPTIONS** /case-deadlines | 
[**caseDocumentsDocketEntryIdAppendPdfOptions**](DefaultApi.md#caseDocumentsDocketEntryIdAppendPdfOptions) | **OPTIONS** /case-documents/{docketEntryId}/append-pdf | 
[**caseDocumentsDocketNumberCourtIssuedDocketEntryOptions**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedDocketEntryOptions) | **OPTIONS** /case-documents/{docketNumber}/court-issued-docket-entry | 
[**caseDocumentsDocketNumberCourtIssuedDocketEntryPost**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedDocketEntryPost) | **POST** /case-documents/{docketNumber}/court-issued-docket-entry | creates a docket entry for a court-issued document on the case
[**caseDocumentsDocketNumberCourtIssuedDocketEntryPut**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedDocketEntryPut) | **PUT** /case-documents/{docketNumber}/court-issued-docket-entry | updates a docket entry for a court-issued document on the case
[**caseDocumentsDocketNumberCourtIssuedOrderOptions**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedOrderOptions) | **OPTIONS** /case-documents/{docketNumber}/court-issued-order | 
[**caseDocumentsDocketNumberCourtIssuedOrderPost**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedOrderPost) | **POST** /case-documents/{docketNumber}/court-issued-order | files a court issued order on the case
[**caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions) | **OPTIONS** /case-documents/{docketNumber}/court-issued-orders/{docketEntryId} | 
[**caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut**](DefaultApi.md#caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut) | **PUT** /case-documents/{docketNumber}/court-issued-orders/{docketEntryId} | updates the draft court issued order
[**caseDocumentsDocketNumberDocketEntryCompleteOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryCompleteOptions) | **OPTIONS** /case-documents/{docketNumber}/docket-entry-complete | 
[**caseDocumentsDocketNumberDocketEntryIdCoversheetOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdCoversheetOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/coversheet | 
[**caseDocumentsDocketNumberDocketEntryIdOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId} | 
[**caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/remove-pdf | 
[**caseDocumentsDocketNumberDocketEntryIdSealOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdSealOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/seal | 
[**caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/serve-court-issued | 
[**caseDocumentsDocketNumberDocketEntryIdServeOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdServeOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/serve | 
[**caseDocumentsDocketNumberDocketEntryIdSignOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdSignOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/sign | 
[**caseDocumentsDocketNumberDocketEntryIdStrikeOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdStrikeOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/strike | 
[**caseDocumentsDocketNumberDocketEntryIdUnsealOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdUnsealOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/unseal | 
[**caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions) | **OPTIONS** /case-documents/{docketNumber}/{docketEntryId}/work-items | 
[**caseDocumentsDocketNumberDocketEntryInProgressOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryInProgressOptions) | **OPTIONS** /case-documents/{docketNumber}/docket-entry-in-progress | 
[**caseDocumentsDocketNumberDocketEntryMetaOptions**](DefaultApi.md#caseDocumentsDocketNumberDocketEntryMetaOptions) | **OPTIONS** /case-documents/{docketNumber}/docket-entry-meta | 
[**caseDocumentsDocketNumberExternalDocumentOptions**](DefaultApi.md#caseDocumentsDocketNumberExternalDocumentOptions) | **OPTIONS** /case-documents/{docketNumber}/external-document | 
[**caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions**](DefaultApi.md#caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions) | **OPTIONS** /case-documents/{docketNumber}/{key}/document-download-url | 
[**caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions**](DefaultApi.md#caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions) | **OPTIONS** /case-documents/{docketNumber}/{key}/download-policy-url | 
[**caseDocumentsDocketNumberMotionDocketEntryIdStampOptions**](DefaultApi.md#caseDocumentsDocketNumberMotionDocketEntryIdStampOptions) | **OPTIONS** /case-documents/{docketNumber}/{motionDocketEntryId}/stamp | 
[**caseDocumentsDocketNumberPaperFilingOptions**](DefaultApi.md#caseDocumentsDocketNumberPaperFilingOptions) | **OPTIONS** /case-documents/{docketNumber}/paper-filing | 
[**caseDocumentsDocumentContentsIdDocumentContentsOptions**](DefaultApi.md#caseDocumentsDocumentContentsIdDocumentContentsOptions) | **OPTIONS** /case-documents/{documentContentsId}/document-contents | 
[**caseDocumentsOrderSearchOptions**](DefaultApi.md#caseDocumentsOrderSearchOptions) | **OPTIONS** /case-documents/order-search | 
[**caseMetaDocketNumberAddPetitionerOptions**](DefaultApi.md#caseMetaDocketNumberAddPetitionerOptions) | **OPTIONS** /case-meta/{docketNumber}/add-petitioner, | 
[**caseMetaDocketNumberBlockOptions**](DefaultApi.md#caseMetaDocketNumberBlockOptions) | **OPTIONS** /case-meta/{docketNumber}/block | 
[**caseMetaDocketNumberCaseContextOptions**](DefaultApi.md#caseMetaDocketNumberCaseContextOptions) | **OPTIONS** /case-meta/{docketNumber}/case-context | 
[**caseMetaDocketNumberConsolidateCaseOptions**](DefaultApi.md#caseMetaDocketNumberConsolidateCaseOptions) | **OPTIONS** /case-meta/{docketNumber}/consolidate-case | 
[**caseMetaDocketNumberHighPriorityOptions**](DefaultApi.md#caseMetaDocketNumberHighPriorityOptions) | **OPTIONS** /case-meta/{docketNumber}/high-priority | 
[**caseMetaDocketNumberOtherStatisticsOptions**](DefaultApi.md#caseMetaDocketNumberOtherStatisticsOptions) | **OPTIONS** /case-meta/{docketNumber}/other-statistics | 
[**caseMetaDocketNumberQcCompleteOptions**](DefaultApi.md#caseMetaDocketNumberQcCompleteOptions) | **OPTIONS** /case-meta/{docketNumber}/qc-complete | 
[**caseMetaDocketNumberSealAddressContactIdOptions**](DefaultApi.md#caseMetaDocketNumberSealAddressContactIdOptions) | **OPTIONS** /case-meta/{docketNumber}/seal-address/{contactId} | 
[**caseMetaDocketNumberSealOptions**](DefaultApi.md#caseMetaDocketNumberSealOptions) | **OPTIONS** /case-meta/{docketNumber}/seal | 
[**caseMetaDocketNumberStatisticsOptions**](DefaultApi.md#caseMetaDocketNumberStatisticsOptions) | **OPTIONS** /case-meta/{docketNumber}/statistics | 
[**caseNotesDocketNumberOptions**](DefaultApi.md#caseNotesDocketNumberOptions) | **OPTIONS** /case-notes/{docketNumber} | 
[**caseNotesDocketNumberUserNotesOptions**](DefaultApi.md#caseNotesDocketNumberUserNotesOptions) | **OPTIONS** /case-notes/{docketNumber}/user-notes | 
[**casePartiesDocketNumberAssociatePrivatePractitionerOptions**](DefaultApi.md#casePartiesDocketNumberAssociatePrivatePractitionerOptions) | **OPTIONS** /case-parties/{docketNumber}/associate-private-practitioner | 
[**casePartiesDocketNumberAssociateRespondentOptions**](DefaultApi.md#casePartiesDocketNumberAssociateRespondentOptions) | **OPTIONS** /case-parties/{docketNumber}/associate-respondent | 
[**casePartiesDocketNumberCaseDetailsOptions**](DefaultApi.md#casePartiesDocketNumberCaseDetailsOptions) | **OPTIONS** /case-parties/{docketNumber}/case-details | 
[**casePartiesDocketNumberContactPrimaryOptions**](DefaultApi.md#casePartiesDocketNumberContactPrimaryOptions) | **OPTIONS** /case-parties/{docketNumber}/contact-primary | 
[**casePartiesDocketNumberContactSecondaryOptions**](DefaultApi.md#casePartiesDocketNumberContactSecondaryOptions) | **OPTIONS** /case-parties/{docketNumber}/contact-secondary | 
[**casePartiesDocketNumberCounselUserIdOptions**](DefaultApi.md#casePartiesDocketNumberCounselUserIdOptions) | **OPTIONS** /case-parties/{docketNumber}/counsel/{userId} | 
[**casePartiesDocketNumberPetitionerInfoOptions**](DefaultApi.md#casePartiesDocketNumberPetitionerInfoOptions) | **OPTIONS** /case-parties/{docketNumber}/petitioner-info | 
[**casesDocketNumberConsolidatedCasesOptions**](DefaultApi.md#casesDocketNumberConsolidatedCasesOptions) | **OPTIONS** /cases/{docketNumber}/consolidated-cases | 
[**casesDocketNumberIrsPetitionPackageOptions**](DefaultApi.md#casesDocketNumberIrsPetitionPackageOptions) | **OPTIONS** /cases/{docketNumber}/irsPetitionPackage | 
[**casesDocketNumberOptions**](DefaultApi.md#casesDocketNumberOptions) | **OPTIONS** /cases/{docketNumber} | 
[**casesDocketNumberRemovePendingDocketEntryIdOptions**](DefaultApi.md#casesDocketNumberRemovePendingDocketEntryIdOptions) | **OPTIONS** /cases/{docketNumber}/remove-pending/{docketEntryId} | 
[**casesDocketNumberStatisticsStatisticIdOptions**](DefaultApi.md#casesDocketNumberStatisticsStatisticIdOptions) | **OPTIONS** /cases/{docketNumber}/statistics/{statisticId} | 
[**casesOptions**](DefaultApi.md#casesOptions) | **OPTIONS** /cases | 
[**casesPaperOptions**](DefaultApi.md#casesPaperOptions) | **OPTIONS** /cases/paper | 
[**casesSearchOptions**](DefaultApi.md#casesSearchOptions) | **OPTIONS** /cases/search | 
[**documentsFilingReceiptPdfOptions**](DefaultApi.md#documentsFilingReceiptPdfOptions) | **OPTIONS** /documents/filing-receipt-pdf | 
[**documentsFilingReceiptPdfPost**](DefaultApi.md#documentsFilingReceiptPdfPost) | **POST** /documents/filing-receipt-pdf | create a pdf receipt for filing a document or documents
[**documentsKeyValidateOptions**](DefaultApi.md#documentsKeyValidateOptions) | **OPTIONS** /documents/{key}/validate | 
[**documentsKeyVirusScanOptions**](DefaultApi.md#documentsKeyVirusScanOptions) | **OPTIONS** /documents/{key}/virus-scan | 
[**documentsUploadPolicyOptions**](DefaultApi.md#documentsUploadPolicyOptions) | **OPTIONS** /documents/upload-policy | 
[**featureFlagFeatureFlagGet**](DefaultApi.md#featureFlagFeatureFlagGet) | **GET** /feature-flag/{featureFlag} | get feature flag value
[**featureFlagFeatureFlagOptions**](DefaultApi.md#featureFlagFeatureFlagOptions) | **OPTIONS** /feature-flag/{featureFlag} | 
[**irsPractitionersRespondentIdCasesOptions**](DefaultApi.md#irsPractitionersRespondentIdCasesOptions) | **OPTIONS** /irsPractitioners/{respondentId}/cases | 
[**judgesOptions**](DefaultApi.md#judgesOptions) | **OPTIONS** /judges | 
[**messagesCaseDocketNumberOptions**](DefaultApi.md#messagesCaseDocketNumberOptions) | **OPTIONS** /messages/case/{docketNumber} | 
[**messagesCompletedSectionSectionIdOptions**](DefaultApi.md#messagesCompletedSectionSectionIdOptions) | **OPTIONS** /messages/completed/section/{sectionId} | 
[**messagesCompletedUserIdOptions**](DefaultApi.md#messagesCompletedUserIdOptions) | **OPTIONS** /messages/completed/{userId} | 
[**messagesInboxSectionSectionOptions**](DefaultApi.md#messagesInboxSectionSectionOptions) | **OPTIONS** /messages/inbox/section/{section} | 
[**messagesInboxUserIdOptions**](DefaultApi.md#messagesInboxUserIdOptions) | **OPTIONS** /messages/inbox/{userId} | 
[**messagesMessageIdOptions**](DefaultApi.md#messagesMessageIdOptions) | **OPTIONS** /messages/{messageId} | 
[**messagesMessageIdReadOptions**](DefaultApi.md#messagesMessageIdReadOptions) | **OPTIONS** /messages/{messageId}/read | 
[**messagesOptions**](DefaultApi.md#messagesOptions) | **OPTIONS** /messages | 
[**messagesOutboxSectionSectionOptions**](DefaultApi.md#messagesOutboxSectionSectionOptions) | **OPTIONS** /messages/outbox/section/{section} | 
[**messagesOutboxUserIdOptions**](DefaultApi.md#messagesOutboxUserIdOptions) | **OPTIONS** /messages/outbox/{userId} | 
[**messagesParentMessageIdCompleteOptions**](DefaultApi.md#messagesParentMessageIdCompleteOptions) | **OPTIONS** /messages/{parentMessageId}/complete | 
[**messagesParentMessageIdForwardOptions**](DefaultApi.md#messagesParentMessageIdForwardOptions) | **OPTIONS** /messages/{parentMessageId}/forward | 
[**messagesParentMessageIdReplyOptions**](DefaultApi.md#messagesParentMessageIdReplyOptions) | **OPTIONS** /messages/{parentMessageId}/reply | 
[**practitionersBarNumberOptions**](DefaultApi.md#practitionersBarNumberOptions) | **OPTIONS** /practitioners/{barNumber} | 
[**practitionersOptions**](DefaultApi.md#practitionersOptions) | **OPTIONS** /practitioners | 
[**publicApiCasesDocketNumberOptions**](DefaultApi.md#publicApiCasesDocketNumberOptions) | **OPTIONS** /public-api/cases/{docketNumber} | 
[**publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions**](DefaultApi.md#publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions) | **OPTIONS** /public-api/{docketNumber}/{key}/public-document-download-url | 
[**publicApiDocketNumberSearchDocketNumberOptions**](DefaultApi.md#publicApiDocketNumberSearchDocketNumberOptions) | **OPTIONS** /public-api/docket-number-search/{docketNumber} | 
[**publicApiHealthOptions**](DefaultApi.md#publicApiHealthOptions) | **OPTIONS** /public-api/health | 
[**publicApiOpinionSearchOptions**](DefaultApi.md#publicApiOpinionSearchOptions) | **OPTIONS** /public-api/opinion-search | 
[**publicApiOrderSearchOptions**](DefaultApi.md#publicApiOrderSearchOptions) | **OPTIONS** /public-api/order-search | 
[**publicApiSearchOptions**](DefaultApi.md#publicApiSearchOptions) | **OPTIONS** /public-api/search | 
[**publicApiTodaysOpinionsOptions**](DefaultApi.md#publicApiTodaysOpinionsOptions) | **OPTIONS** /public-api/todays-opinions | 
[**publicApiTodaysOrdersPageSortOrderOptions**](DefaultApi.md#publicApiTodaysOrdersPageSortOrderOptions) | **OPTIONS** /public-api/todays-orders/{page}/{sortOrder} | 
[**reportsBlockedTrialLocationOptions**](DefaultApi.md#reportsBlockedTrialLocationOptions) | **OPTIONS** /reports/blocked/{trialLocation} | 
[**reportsCaseInventoryReportOptions**](DefaultApi.md#reportsCaseInventoryReportOptions) | **OPTIONS** /reports/case-inventory-report | 
[**reportsPendingItemsGet**](DefaultApi.md#reportsPendingItemsGet) | **GET** /reports/pending-items | get all pending items
[**reportsPendingItemsOptions**](DefaultApi.md#reportsPendingItemsOptions) | **OPTIONS** /reports/pending-items | 
[**reportsPendingReportGet**](DefaultApi.md#reportsPendingReportGet) | **GET** /reports/pending-report | create a pdf of the pending report
[**reportsPendingReportOptions**](DefaultApi.md#reportsPendingReportOptions) | **OPTIONS** /reports/pending-report | 
[**reportsPlanningReportOptions**](DefaultApi.md#reportsPlanningReportOptions) | **OPTIONS** /reports/planning-report | 
[**reportsPlanningReportPost**](DefaultApi.md#reportsPlanningReportPost) | **POST** /reports/planning-report | create a pdf of the trial session planning report
[**reportsPrintableCaseInventoryReportOptions**](DefaultApi.md#reportsPrintableCaseInventoryReportOptions) | **OPTIONS** /reports/printable-case-inventory-report | 
[**reportsTrialCalendarPdfOptions**](DefaultApi.md#reportsTrialCalendarPdfOptions) | **OPTIONS** /reports/trial-calendar-pdf | 
[**reportsTrialCalendarPdfPost**](DefaultApi.md#reportsTrialCalendarPdfPost) | **POST** /reports/trial-calendar-pdf | create a pdf of the trial session calendar
[**sectionsSectionDocumentQcInboxOptions**](DefaultApi.md#sectionsSectionDocumentQcInboxOptions) | **OPTIONS** /sections/{section}/document-qc/inbox | 
[**sectionsSectionDocumentQcServedOptions**](DefaultApi.md#sectionsSectionDocumentQcServedOptions) | **OPTIONS** /sections/{section}/document-qc/served | 
[**sectionsSectionUsersOptions**](DefaultApi.md#sectionsSectionUsersOptions) | **OPTIONS** /sections/{section}/users | 
[**trialSessionsOptions**](DefaultApi.md#trialSessionsOptions) | **OPTIONS** /trial-sessions | 
[**trialSessionsTrialSessionIdCasesDocketNumberOptions**](DefaultApi.md#trialSessionsTrialSessionIdCasesDocketNumberOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/cases/{docketNumber} | 
[**trialSessionsTrialSessionIdEligibleCasesOptions**](DefaultApi.md#trialSessionsTrialSessionIdEligibleCasesOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/eligible-cases | 
[**trialSessionsTrialSessionIdGenerateNoticesOptions**](DefaultApi.md#trialSessionsTrialSessionIdGenerateNoticesOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/generate-notices | 
[**trialSessionsTrialSessionIdGetAssociatedCasesOptions**](DefaultApi.md#trialSessionsTrialSessionIdGetAssociatedCasesOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/getAssociatedCases | 
[**trialSessionsTrialSessionIdOptions**](DefaultApi.md#trialSessionsTrialSessionIdOptions) | **OPTIONS** /trial-sessions/{trialSessionId} | 
[**trialSessionsTrialSessionIdPrintableWorkingCopyOptions**](DefaultApi.md#trialSessionsTrialSessionIdPrintableWorkingCopyOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/printable-working-copy | 
[**trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions**](DefaultApi.md#trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/remove-case/{docketNumber} | 
[**trialSessionsTrialSessionIdSetCalendarOptions**](DefaultApi.md#trialSessionsTrialSessionIdSetCalendarOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/set-calendar | 
[**trialSessionsTrialSessionIdSetHearingDocketNumberOptions**](DefaultApi.md#trialSessionsTrialSessionIdSetHearingDocketNumberOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/set-hearing/{docketNumber} | 
[**trialSessionsTrialSessionIdSetSwingSessionOptions**](DefaultApi.md#trialSessionsTrialSessionIdSetSwingSessionOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/set-swing-session | 
[**trialSessionsTrialSessionIdWorkingCopyOptions**](DefaultApi.md#trialSessionsTrialSessionIdWorkingCopyOptions) | **OPTIONS** /trial-sessions/{trialSessionId}/working-copy | 
[**usersInternalOptions**](DefaultApi.md#usersInternalOptions) | **OPTIONS** /users/internal | 
[**usersOptions**](DefaultApi.md#usersOptions) | **OPTIONS** /users | 
[**usersPendingEmailOptions**](DefaultApi.md#usersPendingEmailOptions) | **OPTIONS** /users/pending-email | 
[**usersUserIdCaseDocketNumberPendingOptions**](DefaultApi.md#usersUserIdCaseDocketNumberPendingOptions) | **OPTIONS** /users/{userId}/case/{docketNumber}/pending | 
[**usersUserIdCasesOptions**](DefaultApi.md#usersUserIdCasesOptions) | **OPTIONS** /users/{userId}/cases | 
[**usersUserIdContactInfoOptions**](DefaultApi.md#usersUserIdContactInfoOptions) | **OPTIONS** /users/{userId}/contact-info | 
[**usersUserIdDocumentQcInboxOptions**](DefaultApi.md#usersUserIdDocumentQcInboxOptions) | **OPTIONS** /users/{userId}/document-qc/inbox | 
[**usersUserIdDocumentQcServedOptions**](DefaultApi.md#usersUserIdDocumentQcServedOptions) | **OPTIONS** /users/{userId}/document-qc/served | 
[**usersUserIdPendingEmailOptions**](DefaultApi.md#usersUserIdPendingEmailOptions) | **OPTIONS** /users/{userId}/pending-email | 
[**workItemsOptions**](DefaultApi.md#workItemsOptions) | **OPTIONS** /work-items | 
[**workItemsWorkItemIdAssigneeOptions**](DefaultApi.md#workItemsWorkItemIdAssigneeOptions) | **OPTIONS** /work-items/{workItemId}/assignee | 
[**workItemsWorkItemIdCompleteOptions**](DefaultApi.md#workItemsWorkItemIdCompleteOptions) | **OPTIONS** /work-items/{workItemId}/complete | 
[**workItemsWorkItemIdOptions**](DefaultApi.md#workItemsWorkItemIdOptions) | **OPTIONS** /work-items/{workItemId} | 
[**workItemsWorkItemIdReadOptions**](DefaultApi.md#workItemsWorkItemIdReadOptions) | **OPTIONS** /work-items/{workItemId}/read | 

<a name="apiCasesDocketNumberGenerateDocketRecordOptions"></a>
# **apiCasesDocketNumberGenerateDocketRecordOptions**
> apiCasesDocketNumberGenerateDocketRecordOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.apiCasesDocketNumberGenerateDocketRecordOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiCasesDocketNumberGenerateDocketRecordPost"></a>
# **apiCasesDocketNumberGenerateDocketRecordPost**
> apiCasesDocketNumberGenerateDocketRecordPost(docketNumber)

create a pdf of the docket record for a case

create a pdf of the docket record for a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.apiCasesDocketNumberGenerateDocketRecordPost(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiCourtIssuedOrderOptions"></a>
# **apiCourtIssuedOrderOptions**
> apiCourtIssuedOrderOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiCourtIssuedOrderOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiCourtIssuedOrderPost"></a>
# **apiCourtIssuedOrderPost**
> apiCourtIssuedOrderPost()

create a court issued order pdf preview

create a court issued order pdf preview. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiCourtIssuedOrderPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiDocketRecordPdfOptions"></a>
# **apiDocketRecordPdfOptions**
> apiDocketRecordPdfOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiDocketRecordPdfOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiDocketRecordPdfPost"></a>
# **apiDocketRecordPdfPost**
> apiDocketRecordPdfPost()

create a pdf of the docket record for a case

create a pdf of the docket record for a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiDocketRecordPdfPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiNotificationsOptions"></a>
# **apiNotificationsOptions**
> apiNotificationsOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiNotificationsOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiRunBatchProcessPost"></a>
# **apiRunBatchProcessPost**
> PolicyUrl apiRunBatchProcessPost()

run IRS batch process

Run the (temporary) send to IRS batch process, which creates a ZIP file of petition documents and uploads it to S3. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiRunBatchProcessPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PolicyUrl**](PolicyUrl.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*

<a name="apiSwaggerGet"></a>
# **apiSwaggerGet**
> apiSwaggerGet()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiSwaggerGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiSwaggerJsonGet"></a>
# **apiSwaggerJsonGet**
> apiSwaggerJsonGet()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiSwaggerJsonGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiSwaggerJsonOptions"></a>
# **apiSwaggerJsonOptions**
> apiSwaggerJsonOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiSwaggerJsonOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="apiSwaggerOptions"></a>
# **apiSwaggerOptions**
> apiSwaggerOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.apiSwaggerOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="asyncUsersVerifyEmailOptions"></a>
# **asyncUsersVerifyEmailOptions**
> asyncUsersVerifyEmailOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.asyncUsersVerifyEmailOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="authLoginOptions"></a>
# **authLoginOptions**
> authLoginOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.authLoginOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="authRefreshOptions"></a>
# **authRefreshOptions**
> authRefreshOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.authRefreshOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDeadlinesDocketNumberCaseDeadlineIdOptions"></a>
# **caseDeadlinesDocketNumberCaseDeadlineIdOptions**
> caseDeadlinesDocketNumberCaseDeadlineIdOptions(docketNumber, caseDeadlineId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let caseDeadlineId = "caseDeadlineId_example"; // String | 

apiInstance.caseDeadlinesDocketNumberCaseDeadlineIdOptions(docketNumber, caseDeadlineId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **caseDeadlineId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDeadlinesDocketNumberOptions"></a>
# **caseDeadlinesDocketNumberOptions**
> caseDeadlinesDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDeadlinesDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDeadlinesOptions"></a>
# **caseDeadlinesOptions**
> caseDeadlinesOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.caseDeadlinesOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketEntryIdAppendPdfOptions"></a>
# **caseDocumentsDocketEntryIdAppendPdfOptions**
> caseDocumentsDocketEntryIdAppendPdfOptions(docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketEntryIdAppendPdfOptions(docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedDocketEntryOptions"></a>
# **caseDocumentsDocketNumberCourtIssuedDocketEntryOptions**
> caseDocumentsDocketNumberCourtIssuedDocketEntryOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberCourtIssuedDocketEntryOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedDocketEntryPost"></a>
# **caseDocumentsDocketNumberCourtIssuedDocketEntryPost**
> caseDocumentsDocketNumberCourtIssuedDocketEntryPost(docketNumber)

creates a docket entry for a court-issued document on the case

creates a docket entry for a court-issued document on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberCourtIssuedDocketEntryPost(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedDocketEntryPut"></a>
# **caseDocumentsDocketNumberCourtIssuedDocketEntryPut**
> caseDocumentsDocketNumberCourtIssuedDocketEntryPut(docketNumber)

updates a docket entry for a court-issued document on the case

updates a docket entry for a court-issued document on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberCourtIssuedDocketEntryPut(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedOrderOptions"></a>
# **caseDocumentsDocketNumberCourtIssuedOrderOptions**
> caseDocumentsDocketNumberCourtIssuedOrderOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberCourtIssuedOrderOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedOrderPost"></a>
# **caseDocumentsDocketNumberCourtIssuedOrderPost**
> caseDocumentsDocketNumberCourtIssuedOrderPost(docketNumber)

files a court issued order on the case

files a court issued order on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberCourtIssuedOrderPost(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions"></a>
# **caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions**
> caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions(docketNumber, docketEntryId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 
let opts = { 
  'body': new DevEfCms.CourtissuedordersDocketEntryIdBody1() // CourtissuedordersDocketEntryIdBody1 | the draft order information
};
apiInstance.caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdOptions(docketNumber, docketEntryId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 
 **body** | [**CourtissuedordersDocketEntryIdBody1**](CourtissuedordersDocketEntryIdBody1.md)| the draft order information | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut"></a>
# **caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut**
> caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut(docketNumber, docketEntryId, opts)

updates the draft court issued order

updates the draft court issued order. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 
let opts = { 
  'body': new DevEfCms.CourtissuedordersDocketEntryIdBody() // CourtissuedordersDocketEntryIdBody | the draft order information
};
apiInstance.caseDocumentsDocketNumberCourtIssuedOrdersDocketEntryIdPut(docketNumber, docketEntryId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 
 **body** | [**CourtissuedordersDocketEntryIdBody**](CourtissuedordersDocketEntryIdBody.md)| the draft order information | [optional] 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryCompleteOptions"></a>
# **caseDocumentsDocketNumberDocketEntryCompleteOptions**
> caseDocumentsDocketNumberDocketEntryCompleteOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryCompleteOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdCoversheetOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdCoversheetOptions**
> caseDocumentsDocketNumberDocketEntryIdCoversheetOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdCoversheetOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdOptions**
> caseDocumentsDocketNumberDocketEntryIdOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions**
> caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdRemovePdfOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdSealOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdSealOptions**
> caseDocumentsDocketNumberDocketEntryIdSealOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdSealOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions**
> caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdServeOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdServeOptions**
> caseDocumentsDocketNumberDocketEntryIdServeOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdServeOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdSignOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdSignOptions**
> caseDocumentsDocketNumberDocketEntryIdSignOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdSignOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdStrikeOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdStrikeOptions**
> caseDocumentsDocketNumberDocketEntryIdStrikeOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdStrikeOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdUnsealOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdUnsealOptions**
> caseDocumentsDocketNumberDocketEntryIdUnsealOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdUnsealOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions"></a>
# **caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions**
> caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdWorkItemsOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryInProgressOptions"></a>
# **caseDocumentsDocketNumberDocketEntryInProgressOptions**
> caseDocumentsDocketNumberDocketEntryInProgressOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryInProgressOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryMetaOptions"></a>
# **caseDocumentsDocketNumberDocketEntryMetaOptions**
> caseDocumentsDocketNumberDocketEntryMetaOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryMetaOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberExternalDocumentOptions"></a>
# **caseDocumentsDocketNumberExternalDocumentOptions**
> caseDocumentsDocketNumberExternalDocumentOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberExternalDocumentOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions"></a>
# **caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions**
> caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions(docketNumber, key)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let key = "key_example"; // String | 

apiInstance.caseDocumentsDocketNumberKeyDocumentDownloadUrlOptions(docketNumber, key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions"></a>
# **caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions**
> caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions(key, docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let key = "key_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberKeyDownloadPolicyUrlOptions(key, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberMotionDocketEntryIdStampOptions"></a>
# **caseDocumentsDocketNumberMotionDocketEntryIdStampOptions**
> caseDocumentsDocketNumberMotionDocketEntryIdStampOptions(docketNumber, motionDocketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let motionDocketEntryId = "motionDocketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberMotionDocketEntryIdStampOptions(docketNumber, motionDocketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **motionDocketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberPaperFilingOptions"></a>
# **caseDocumentsDocketNumberPaperFilingOptions**
> caseDocumentsDocketNumberPaperFilingOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDocumentsDocketNumberPaperFilingOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocumentContentsIdDocumentContentsOptions"></a>
# **caseDocumentsDocumentContentsIdDocumentContentsOptions**
> caseDocumentsDocumentContentsIdDocumentContentsOptions(documentContentsId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let documentContentsId = "documentContentsId_example"; // String | 

apiInstance.caseDocumentsDocumentContentsIdDocumentContentsOptions(documentContentsId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **documentContentsId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsOrderSearchOptions"></a>
# **caseDocumentsOrderSearchOptions**
> caseDocumentsOrderSearchOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.caseDocumentsOrderSearchOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberAddPetitionerOptions"></a>
# **caseMetaDocketNumberAddPetitionerOptions**
> caseMetaDocketNumberAddPetitionerOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberAddPetitionerOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberBlockOptions"></a>
# **caseMetaDocketNumberBlockOptions**
> caseMetaDocketNumberBlockOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberBlockOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberCaseContextOptions"></a>
# **caseMetaDocketNumberCaseContextOptions**
> caseMetaDocketNumberCaseContextOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberCaseContextOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberConsolidateCaseOptions"></a>
# **caseMetaDocketNumberConsolidateCaseOptions**
> caseMetaDocketNumberConsolidateCaseOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberConsolidateCaseOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberHighPriorityOptions"></a>
# **caseMetaDocketNumberHighPriorityOptions**
> caseMetaDocketNumberHighPriorityOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberHighPriorityOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberOtherStatisticsOptions"></a>
# **caseMetaDocketNumberOtherStatisticsOptions**
> caseMetaDocketNumberOtherStatisticsOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberOtherStatisticsOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberQcCompleteOptions"></a>
# **caseMetaDocketNumberQcCompleteOptions**
> caseMetaDocketNumberQcCompleteOptions(docketNumber, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let opts = { 
  'body': new DevEfCms.DocketNumberQccompleteBody1() // DocketNumberQccompleteBody1 | the trial session info needed to identify and update a trial session
};
apiInstance.caseMetaDocketNumberQcCompleteOptions(docketNumber, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **body** | [**DocketNumberQccompleteBody1**](DocketNumberQccompleteBody1.md)| the trial session info needed to identify and update a trial session | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="caseMetaDocketNumberSealAddressContactIdOptions"></a>
# **caseMetaDocketNumberSealAddressContactIdOptions**
> caseMetaDocketNumberSealAddressContactIdOptions(docketNumber, contactId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let contactId = "contactId_example"; // String | 

apiInstance.caseMetaDocketNumberSealAddressContactIdOptions(docketNumber, contactId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **contactId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberSealOptions"></a>
# **caseMetaDocketNumberSealOptions**
> caseMetaDocketNumberSealOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberSealOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseMetaDocketNumberStatisticsOptions"></a>
# **caseMetaDocketNumberStatisticsOptions**
> caseMetaDocketNumberStatisticsOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberStatisticsOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseNotesDocketNumberOptions"></a>
# **caseNotesDocketNumberOptions**
> caseNotesDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseNotesDocketNumberUserNotesOptions"></a>
# **caseNotesDocketNumberUserNotesOptions**
> caseNotesDocketNumberUserNotesOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberUserNotesOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberAssociatePrivatePractitionerOptions"></a>
# **casePartiesDocketNumberAssociatePrivatePractitionerOptions**
> casePartiesDocketNumberAssociatePrivatePractitionerOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberAssociatePrivatePractitionerOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberAssociateRespondentOptions"></a>
# **casePartiesDocketNumberAssociateRespondentOptions**
> casePartiesDocketNumberAssociateRespondentOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberAssociateRespondentOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberCaseDetailsOptions"></a>
# **casePartiesDocketNumberCaseDetailsOptions**
> casePartiesDocketNumberCaseDetailsOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberCaseDetailsOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberContactPrimaryOptions"></a>
# **casePartiesDocketNumberContactPrimaryOptions**
> casePartiesDocketNumberContactPrimaryOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberContactPrimaryOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberContactSecondaryOptions"></a>
# **casePartiesDocketNumberContactSecondaryOptions**
> casePartiesDocketNumberContactSecondaryOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberContactSecondaryOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberCounselUserIdOptions"></a>
# **casePartiesDocketNumberCounselUserIdOptions**
> casePartiesDocketNumberCounselUserIdOptions(docketNumber, userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let userId = "userId_example"; // String | 

apiInstance.casePartiesDocketNumberCounselUserIdOptions(docketNumber, userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casePartiesDocketNumberPetitionerInfoOptions"></a>
# **casePartiesDocketNumberPetitionerInfoOptions**
> casePartiesDocketNumberPetitionerInfoOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberPetitionerInfoOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesDocketNumberConsolidatedCasesOptions"></a>
# **casesDocketNumberConsolidatedCasesOptions**
> casesDocketNumberConsolidatedCasesOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberConsolidatedCasesOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesDocketNumberIrsPetitionPackageOptions"></a>
# **casesDocketNumberIrsPetitionPackageOptions**
> casesDocketNumberIrsPetitionPackageOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberIrsPetitionPackageOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesDocketNumberOptions"></a>
# **casesDocketNumberOptions**
> casesDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesDocketNumberRemovePendingDocketEntryIdOptions"></a>
# **casesDocketNumberRemovePendingDocketEntryIdOptions**
> casesDocketNumberRemovePendingDocketEntryIdOptions(docketNumber, docketEntryId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.casesDocketNumberRemovePendingDocketEntryIdOptions(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesDocketNumberStatisticsStatisticIdOptions"></a>
# **casesDocketNumberStatisticsStatisticIdOptions**
> casesDocketNumberStatisticsStatisticIdOptions(docketNumber, statisticId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let statisticId = "statisticId_example"; // String | 

apiInstance.casesDocketNumberStatisticsStatisticIdOptions(docketNumber, statisticId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **statisticId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesOptions"></a>
# **casesOptions**
> casesOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.casesOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesPaperOptions"></a>
# **casesPaperOptions**
> casesPaperOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.casesPaperOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="casesSearchOptions"></a>
# **casesSearchOptions**
> casesSearchOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.casesSearchOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsFilingReceiptPdfOptions"></a>
# **documentsFilingReceiptPdfOptions**
> documentsFilingReceiptPdfOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.documentsFilingReceiptPdfOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsFilingReceiptPdfPost"></a>
# **documentsFilingReceiptPdfPost**
> documentsFilingReceiptPdfPost()

create a pdf receipt for filing a document or documents

create a pdf receipt for filing a document or documents. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.documentsFilingReceiptPdfPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsKeyValidateOptions"></a>
# **documentsKeyValidateOptions**
> documentsKeyValidateOptions(key)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let key = "key_example"; // String | 

apiInstance.documentsKeyValidateOptions(key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsKeyVirusScanOptions"></a>
# **documentsKeyVirusScanOptions**
> documentsKeyVirusScanOptions(key)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let key = "key_example"; // String | 

apiInstance.documentsKeyVirusScanOptions(key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="documentsUploadPolicyOptions"></a>
# **documentsUploadPolicyOptions**
> documentsUploadPolicyOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.documentsUploadPolicyOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="featureFlagFeatureFlagGet"></a>
# **featureFlagFeatureFlagGet**
> &#x27;Boolean&#x27; featureFlagFeatureFlagGet(featureFlag)

get feature flag value

get feature flag value. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
let featureFlag = "featureFlag_example"; // String | 

apiInstance.featureFlagFeatureFlagGet(featureFlag, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **featureFlag** | **String**|  | 

### Return type

**&#x27;Boolean&#x27;**

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="featureFlagFeatureFlagOptions"></a>
# **featureFlagFeatureFlagOptions**
> featureFlagFeatureFlagOptions(featureFlag)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let featureFlag = "featureFlag_example"; // String | 

apiInstance.featureFlagFeatureFlagOptions(featureFlag, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **featureFlag** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="irsPractitionersRespondentIdCasesOptions"></a>
# **irsPractitionersRespondentIdCasesOptions**
> irsPractitionersRespondentIdCasesOptions(respondentId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let respondentId = "respondentId_example"; // String | 

apiInstance.irsPractitionersRespondentIdCasesOptions(respondentId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **respondentId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="judgesOptions"></a>
# **judgesOptions**
> judgesOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.judgesOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesCaseDocketNumberOptions"></a>
# **messagesCaseDocketNumberOptions**
> messagesCaseDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.messagesCaseDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesCompletedSectionSectionIdOptions"></a>
# **messagesCompletedSectionSectionIdOptions**
> messagesCompletedSectionSectionIdOptions(sectionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let sectionId = "sectionId_example"; // String | 

apiInstance.messagesCompletedSectionSectionIdOptions(sectionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sectionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesCompletedUserIdOptions"></a>
# **messagesCompletedUserIdOptions**
> messagesCompletedUserIdOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.messagesCompletedUserIdOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesInboxSectionSectionOptions"></a>
# **messagesInboxSectionSectionOptions**
> messagesInboxSectionSectionOptions(section)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let section = "section_example"; // String | 

apiInstance.messagesInboxSectionSectionOptions(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesInboxUserIdOptions"></a>
# **messagesInboxUserIdOptions**
> messagesInboxUserIdOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.messagesInboxUserIdOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesMessageIdOptions"></a>
# **messagesMessageIdOptions**
> messagesMessageIdOptions(messageId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let messageId = "messageId_example"; // String | 

apiInstance.messagesMessageIdOptions(messageId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesMessageIdReadOptions"></a>
# **messagesMessageIdReadOptions**
> messagesMessageIdReadOptions(messageId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let messageId = "messageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.MessageIdReadBody1() // MessageIdReadBody1 | the associated docket number
};
apiInstance.messagesMessageIdReadOptions(messageId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **messageId** | **String**|  | 
 **body** | [**MessageIdReadBody1**](MessageIdReadBody1.md)| the associated docket number | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="messagesOptions"></a>
# **messagesOptions**
> messagesOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.messagesOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesOutboxSectionSectionOptions"></a>
# **messagesOutboxSectionSectionOptions**
> messagesOutboxSectionSectionOptions(section)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let section = "section_example"; // String | 

apiInstance.messagesOutboxSectionSectionOptions(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesOutboxUserIdOptions"></a>
# **messagesOutboxUserIdOptions**
> messagesOutboxUserIdOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.messagesOutboxUserIdOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="messagesParentMessageIdCompleteOptions"></a>
# **messagesParentMessageIdCompleteOptions**
> messagesParentMessageIdCompleteOptions(parentMessageId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdCompleteBody1() // ParentMessageIdCompleteBody1 | the message info
};
apiInstance.messagesParentMessageIdCompleteOptions(parentMessageId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdCompleteBody1**](ParentMessageIdCompleteBody1.md)| the message info | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="messagesParentMessageIdForwardOptions"></a>
# **messagesParentMessageIdForwardOptions**
> messagesParentMessageIdForwardOptions(parentMessageId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdForwardBody1() // ParentMessageIdForwardBody1 | the message info
};
apiInstance.messagesParentMessageIdForwardOptions(parentMessageId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdForwardBody1**](ParentMessageIdForwardBody1.md)| the message info | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="messagesParentMessageIdReplyOptions"></a>
# **messagesParentMessageIdReplyOptions**
> messagesParentMessageIdReplyOptions(parentMessageId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdReplyBody1() // ParentMessageIdReplyBody1 | the message info
};
apiInstance.messagesParentMessageIdReplyOptions(parentMessageId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdReplyBody1**](ParentMessageIdReplyBody1.md)| the message info | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="practitionersBarNumberOptions"></a>
# **practitionersBarNumberOptions**
> practitionersBarNumberOptions(barNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let barNumber = "barNumber_example"; // String | 

apiInstance.practitionersBarNumberOptions(barNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **barNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="practitionersOptions"></a>
# **practitionersOptions**
> practitionersOptions(name)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let name = "name_example"; // String | 

apiInstance.practitionersOptions(name, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiCasesDocketNumberOptions"></a>
# **publicApiCasesDocketNumberOptions**
> publicApiCasesDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.publicApiCasesDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions"></a>
# **publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions**
> publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions(docketNumber, key)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 
let key = "key_example"; // String | 

apiInstance.publicApiDocketNumberKeyPublicDocumentDownloadUrlOptions(docketNumber, key, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **key** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiDocketNumberSearchDocketNumberOptions"></a>
# **publicApiDocketNumberSearchDocketNumberOptions**
> publicApiDocketNumberSearchDocketNumberOptions(docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.publicApiDocketNumberSearchDocketNumberOptions(docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiHealthOptions"></a>
# **publicApiHealthOptions**
> publicApiHealthOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.publicApiHealthOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiOpinionSearchOptions"></a>
# **publicApiOpinionSearchOptions**
> publicApiOpinionSearchOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.publicApiOpinionSearchOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiOrderSearchOptions"></a>
# **publicApiOrderSearchOptions**
> publicApiOrderSearchOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.publicApiOrderSearchOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiSearchOptions"></a>
# **publicApiSearchOptions**
> publicApiSearchOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.publicApiSearchOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiTodaysOpinionsOptions"></a>
# **publicApiTodaysOpinionsOptions**
> publicApiTodaysOpinionsOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.publicApiTodaysOpinionsOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="publicApiTodaysOrdersPageSortOrderOptions"></a>
# **publicApiTodaysOrdersPageSortOrderOptions**
> publicApiTodaysOrdersPageSortOrderOptions(page, sortOrder)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let page = "page_example"; // String | 
let sortOrder = "sortOrder_example"; // String | 

apiInstance.publicApiTodaysOrdersPageSortOrderOptions(page, sortOrder, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**|  | 
 **sortOrder** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsBlockedTrialLocationOptions"></a>
# **reportsBlockedTrialLocationOptions**
> reportsBlockedTrialLocationOptions(trialLocation)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialLocation = "trialLocation_example"; // String | 

apiInstance.reportsBlockedTrialLocationOptions(trialLocation, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialLocation** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsCaseInventoryReportOptions"></a>
# **reportsCaseInventoryReportOptions**
> reportsCaseInventoryReportOptions(opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let opts = { 
  'associatedJudge': "associatedJudge_example", // String | 
  'from': 1.2, // Number | 
  'pageSize': 1.2, // Number | 
  'status': "status_example" // String | 
};
apiInstance.reportsCaseInventoryReportOptions(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **associatedJudge** | **String**|  | [optional] 
 **from** | **Number**|  | [optional] 
 **pageSize** | **Number**|  | [optional] 
 **status** | **String**|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPendingItemsGet"></a>
# **reportsPendingItemsGet**
> Document reportsPendingItemsGet()

get all pending items

get all pending items. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPendingItemsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="reportsPendingItemsOptions"></a>
# **reportsPendingItemsOptions**
> reportsPendingItemsOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPendingItemsOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPendingReportGet"></a>
# **reportsPendingReportGet**
> reportsPendingReportGet()

create a pdf of the pending report

create a pdf of the pending report. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPendingReportGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPendingReportOptions"></a>
# **reportsPendingReportOptions**
> reportsPendingReportOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPendingReportOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPlanningReportOptions"></a>
# **reportsPlanningReportOptions**
> reportsPlanningReportOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPlanningReportOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPlanningReportPost"></a>
# **reportsPlanningReportPost**
> reportsPlanningReportPost()

create a pdf of the trial session planning report

create a pdf of the trial session planning report. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsPlanningReportPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsPrintableCaseInventoryReportOptions"></a>
# **reportsPrintableCaseInventoryReportOptions**
> reportsPrintableCaseInventoryReportOptions(opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let opts = { 
  'associatedJudge': "associatedJudge_example", // String | 
  'status': "status_example" // String | 
};
apiInstance.reportsPrintableCaseInventoryReportOptions(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **associatedJudge** | **String**|  | [optional] 
 **status** | **String**|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsTrialCalendarPdfOptions"></a>
# **reportsTrialCalendarPdfOptions**
> reportsTrialCalendarPdfOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsTrialCalendarPdfOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="reportsTrialCalendarPdfPost"></a>
# **reportsTrialCalendarPdfPost**
> reportsTrialCalendarPdfPost()

create a pdf of the trial session calendar

create a pdf of the trial session calendar. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.reportsTrialCalendarPdfPost((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="sectionsSectionDocumentQcInboxOptions"></a>
# **sectionsSectionDocumentQcInboxOptions**
> sectionsSectionDocumentQcInboxOptions(section, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let section = "section_example"; // String | 
let opts = { 
  'judgeUserName': "judgeUserName_example" // String | 
};
apiInstance.sectionsSectionDocumentQcInboxOptions(section, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 
 **judgeUserName** | **String**|  | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="sectionsSectionDocumentQcServedOptions"></a>
# **sectionsSectionDocumentQcServedOptions**
> sectionsSectionDocumentQcServedOptions(section)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let section = "section_example"; // String | 

apiInstance.sectionsSectionDocumentQcServedOptions(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="sectionsSectionUsersOptions"></a>
# **sectionsSectionUsersOptions**
> sectionsSectionUsersOptions(section)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let section = "section_example"; // String | 

apiInstance.sectionsSectionUsersOptions(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsOptions"></a>
# **trialSessionsOptions**
> trialSessionsOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.trialSessionsOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdCasesDocketNumberOptions"></a>
# **trialSessionsTrialSessionIdCasesDocketNumberOptions**
> trialSessionsTrialSessionIdCasesDocketNumberOptions(trialSessionId, docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdCasesDocketNumberOptions(trialSessionId, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdEligibleCasesOptions"></a>
# **trialSessionsTrialSessionIdEligibleCasesOptions**
> trialSessionsTrialSessionIdEligibleCasesOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdEligibleCasesOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdGenerateNoticesOptions"></a>
# **trialSessionsTrialSessionIdGenerateNoticesOptions**
> trialSessionsTrialSessionIdGenerateNoticesOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdGenerateNoticesOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdGetAssociatedCasesOptions"></a>
# **trialSessionsTrialSessionIdGetAssociatedCasesOptions**
> trialSessionsTrialSessionIdGetAssociatedCasesOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdGetAssociatedCasesOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdOptions"></a>
# **trialSessionsTrialSessionIdOptions**
> trialSessionsTrialSessionIdOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdPrintableWorkingCopyOptions"></a>
# **trialSessionsTrialSessionIdPrintableWorkingCopyOptions**
> trialSessionsTrialSessionIdPrintableWorkingCopyOptions(trialSessionId, opts)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 
let opts = { 
  'body': new DevEfCms.TrialSessionIdPrintableworkingcopyBody1() // TrialSessionIdPrintableworkingcopyBody1 | the trial session info needed to print a working copy
};
apiInstance.trialSessionsTrialSessionIdPrintableWorkingCopyOptions(trialSessionId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 
 **body** | [**TrialSessionIdPrintableworkingcopyBody1**](TrialSessionIdPrintableworkingcopyBody1.md)| the trial session info needed to print a working copy | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions"></a>
# **trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions**
> trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions(trialSessionId, docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdRemoveCaseDocketNumberOptions(trialSessionId, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdSetCalendarOptions"></a>
# **trialSessionsTrialSessionIdSetCalendarOptions**
> trialSessionsTrialSessionIdSetCalendarOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetCalendarOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdSetHearingDocketNumberOptions"></a>
# **trialSessionsTrialSessionIdSetHearingDocketNumberOptions**
> trialSessionsTrialSessionIdSetHearingDocketNumberOptions(trialSessionId, docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetHearingDocketNumberOptions(trialSessionId, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdSetSwingSessionOptions"></a>
# **trialSessionsTrialSessionIdSetSwingSessionOptions**
> trialSessionsTrialSessionIdSetSwingSessionOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetSwingSessionOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdWorkingCopyOptions"></a>
# **trialSessionsTrialSessionIdWorkingCopyOptions**
> trialSessionsTrialSessionIdWorkingCopyOptions(trialSessionId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdWorkingCopyOptions(trialSessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **trialSessionId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersInternalOptions"></a>
# **usersInternalOptions**
> usersInternalOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.usersInternalOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersOptions"></a>
# **usersOptions**
> usersOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.usersOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersPendingEmailOptions"></a>
# **usersPendingEmailOptions**
> usersPendingEmailOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.usersPendingEmailOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdCaseDocketNumberPendingOptions"></a>
# **usersUserIdCaseDocketNumberPendingOptions**
> usersUserIdCaseDocketNumberPendingOptions(userId, docketNumber)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.usersUserIdCaseDocketNumberPendingOptions(userId, docketNumber, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdCasesOptions"></a>
# **usersUserIdCasesOptions**
> usersUserIdCasesOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdCasesOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdContactInfoOptions"></a>
# **usersUserIdContactInfoOptions**
> usersUserIdContactInfoOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdContactInfoOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdDocumentQcInboxOptions"></a>
# **usersUserIdDocumentQcInboxOptions**
> usersUserIdDocumentQcInboxOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdDocumentQcInboxOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdDocumentQcServedOptions"></a>
# **usersUserIdDocumentQcServedOptions**
> usersUserIdDocumentQcServedOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdDocumentQcServedOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdPendingEmailOptions"></a>
# **usersUserIdPendingEmailOptions**
> usersUserIdPendingEmailOptions(userId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdPendingEmailOptions(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="workItemsOptions"></a>
# **workItemsOptions**
> workItemsOptions()



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
apiInstance.workItemsOptions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="workItemsWorkItemIdAssigneeOptions"></a>
# **workItemsWorkItemIdAssigneeOptions**
> workItemsWorkItemIdAssigneeOptions(workItemId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdAssigneeOptions(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="workItemsWorkItemIdCompleteOptions"></a>
# **workItemsWorkItemIdCompleteOptions**
> workItemsWorkItemIdCompleteOptions(workItemId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdCompleteOptions(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="workItemsWorkItemIdOptions"></a>
# **workItemsWorkItemIdOptions**
> workItemsWorkItemIdOptions(workItemId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdOptions(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="workItemsWorkItemIdReadOptions"></a>
# **workItemsWorkItemIdReadOptions**
> workItemsWorkItemIdReadOptions(workItemId)



### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';

let apiInstance = new DevEfCms.DefaultApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdReadOptions(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

