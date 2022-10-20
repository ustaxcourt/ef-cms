# DevEfCms.CasesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost**](CasesApi.md#caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/serve-court-issued | serves a court issued document
[**caseDocumentsDocketNumberDocketEntryIdServePost**](CasesApi.md#caseDocumentsDocketNumberDocketEntryIdServePost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/serve | serves an externally-filed document
[**caseMetaDocketNumberAddPetitionerPut**](CasesApi.md#caseMetaDocketNumberAddPetitionerPut) | **PUT** /case-meta/{docketNumber}/add-petitioner, | adds a petitioner to the case
[**caseMetaDocketNumberBlockDelete**](CasesApi.md#caseMetaDocketNumberBlockDelete) | **DELETE** /case-meta/{docketNumber}/block | removed the block from a case
[**caseMetaDocketNumberBlockPost**](CasesApi.md#caseMetaDocketNumberBlockPost) | **POST** /case-meta/{docketNumber}/block | add a block to a case
[**caseMetaDocketNumberCaseContextPut**](CasesApi.md#caseMetaDocketNumberCaseContextPut) | **PUT** /case-meta/{docketNumber}/case-context | Updates the caption, status, and judge on the given case.
[**caseMetaDocketNumberConsolidateCaseDelete**](CasesApi.md#caseMetaDocketNumberConsolidateCaseDelete) | **DELETE** /case-meta/{docketNumber}/consolidate-case | Unconsolidates the cases passed in the query string.
[**caseMetaDocketNumberConsolidateCasePut**](CasesApi.md#caseMetaDocketNumberConsolidateCasePut) | **PUT** /case-meta/{docketNumber}/consolidate-case | Consolidates two or more cases associated with the given docket number.
[**caseMetaDocketNumberHighPriorityDelete**](CasesApi.md#caseMetaDocketNumberHighPriorityDelete) | **DELETE** /case-meta/{docketNumber}/high-priority | removes the high priority from a case
[**caseMetaDocketNumberHighPriorityPost**](CasesApi.md#caseMetaDocketNumberHighPriorityPost) | **POST** /case-meta/{docketNumber}/high-priority | sets a case as high priority
[**caseMetaDocketNumberOtherStatisticsPost**](CasesApi.md#caseMetaDocketNumberOtherStatisticsPost) | **POST** /case-meta/{docketNumber}/other-statistics | update other statistics on a case
[**caseMetaDocketNumberQcCompletePut**](CasesApi.md#caseMetaDocketNumberQcCompletePut) | **PUT** /case-meta/{docketNumber}/qc-complete | updates the case to be marked as QCed
[**caseMetaDocketNumberSealAddressContactIdPut**](CasesApi.md#caseMetaDocketNumberSealAddressContactIdPut) | **PUT** /case-meta/{docketNumber}/seal-address/{contactId} | updates the specified case contact address as sealed
[**caseMetaDocketNumberSealPut**](CasesApi.md#caseMetaDocketNumberSealPut) | **PUT** /case-meta/{docketNumber}/seal | updates the case as sealed
[**caseMetaDocketNumberStatisticsPost**](CasesApi.md#caseMetaDocketNumberStatisticsPost) | **POST** /case-meta/{docketNumber}/statistics | add a statistic to a case
[**casePartiesDocketNumberAssociatePrivatePractitionerPost**](CasesApi.md#casePartiesDocketNumberAssociatePrivatePractitionerPost) | **POST** /case-parties/{docketNumber}/associate-private-practitioner | associates a practitioner with a case
[**casePartiesDocketNumberAssociateRespondentPost**](CasesApi.md#casePartiesDocketNumberAssociateRespondentPost) | **POST** /case-parties/{docketNumber}/associate-respondent | associates a respondent with a case
[**casePartiesDocketNumberCaseDetailsPut**](CasesApi.md#casePartiesDocketNumberCaseDetailsPut) | **PUT** /case-parties/{docketNumber}/case-details | updates the case details on the case
[**casePartiesDocketNumberContactPrimaryPut**](CasesApi.md#casePartiesDocketNumberContactPrimaryPut) | **PUT** /case-parties/{docketNumber}/contact-primary | Updates the primary contact info on a case
[**casePartiesDocketNumberContactSecondaryPut**](CasesApi.md#casePartiesDocketNumberContactSecondaryPut) | **PUT** /case-parties/{docketNumber}/contact-secondary | Updates the secondary contact info on a case
[**casePartiesDocketNumberCounselUserIdDelete**](CasesApi.md#casePartiesDocketNumberCounselUserIdDelete) | **DELETE** /case-parties/{docketNumber}/counsel/{userId} | Deletes the counsel from the case
[**casePartiesDocketNumberCounselUserIdPut**](CasesApi.md#casePartiesDocketNumberCounselUserIdPut) | **PUT** /case-parties/{docketNumber}/counsel/{userId} | Updates the counsel on the case
[**casePartiesDocketNumberPetitionerInfoPut**](CasesApi.md#casePartiesDocketNumberPetitionerInfoPut) | **PUT** /case-parties/{docketNumber}/petitioner-info | updates the petitioner information on the case
[**casesDocketNumberConsolidatedCasesGet**](CasesApi.md#casesDocketNumberConsolidatedCasesGet) | **GET** /cases/{docketNumber}/consolidated-cases | Returns all consolidated cases associated with the given docket number.
[**casesDocketNumberGet**](CasesApi.md#casesDocketNumberGet) | **GET** /cases/{docketNumber} | get a case by docket number
[**casesDocketNumberHead**](CasesApi.md#casesDocketNumberHead) | **HEAD** /cases/{docketNumber} | get a case existence by docket number
[**casesDocketNumberIrsPetitionPackageDelete**](CasesApi.md#casesDocketNumberIrsPetitionPackageDelete) | **DELETE** /cases/{docketNumber}/irsPetitionPackage | deletes the petition on the case from the holding queue
[**casesDocketNumberIrsPetitionPackagePost**](CasesApi.md#casesDocketNumberIrsPetitionPackagePost) | **POST** /cases/{docketNumber}/irsPetitionPackage | sends the case to the holding queue
[**casesDocketNumberPut**](CasesApi.md#casesDocketNumberPut) | **PUT** /cases/{docketNumber} | update a case
[**casesDocketNumberRemovePendingDocketEntryIdDelete**](CasesApi.md#casesDocketNumberRemovePendingDocketEntryIdDelete) | **DELETE** /cases/{docketNumber}/remove-pending/{docketEntryId} | removes a pending item from a case
[**casesDocketNumberStatisticsStatisticIdDelete**](CasesApi.md#casesDocketNumberStatisticsStatisticIdDelete) | **DELETE** /cases/{docketNumber}/statistics/{statisticId} | removes a statistics entry off a case
[**casesDocketNumberStatisticsStatisticIdPut**](CasesApi.md#casesDocketNumberStatisticsStatisticIdPut) | **PUT** /cases/{docketNumber}/statistics/{statisticId} | updates statistics on a case
[**casesGet**](CasesApi.md#casesGet) | **GET** /cases | Retrieve open and closed cases for the currently authenticated user
[**casesPaperPost**](CasesApi.md#casesPaperPost) | **POST** /cases/paper | create a case from a paper submission
[**casesSearchGet**](CasesApi.md#casesSearchGet) | **GET** /cases/search | search for a case by name, country, state, and/or year filed
[**irsPractitionersRespondentIdCasesGet**](CasesApi.md#irsPractitionersRespondentIdCasesGet) | **GET** /irsPractitioners/{respondentId}/cases | get all cases for a user
[**publicApiCasesDocketNumberGet**](CasesApi.md#publicApiCasesDocketNumberGet) | **GET** /public-api/cases/{docketNumber} | get a case by docket number
[**publicApiDocketNumberSearchDocketNumberGet**](CasesApi.md#publicApiDocketNumberSearchDocketNumberGet) | **GET** /public-api/docket-number-search/{docketNumber} | get a case by docket number
[**publicApiSearchGet**](CasesApi.md#publicApiSearchGet) | **GET** /public-api/search | search for a case by name, country, state, and/or year filed
[**reportsBlockedTrialLocationGet**](CasesApi.md#reportsBlockedTrialLocationGet) | **GET** /reports/blocked/{trialLocation} | get all blocked cases
[**reportsCaseInventoryReportGet**](CasesApi.md#reportsCaseInventoryReportGet) | **GET** /reports/case-inventory-report | get case inventory report
[**reportsPrintableCaseInventoryReportGet**](CasesApi.md#reportsPrintableCaseInventoryReportGet) | **GET** /reports/printable-case-inventory-report | generate printable case inventory report
[**usersUserIdCaseDocketNumberPendingGet**](CasesApi.md#usersUserIdCaseDocketNumberPendingGet) | **GET** /users/{userId}/case/{docketNumber}/pending | verify if user has pending association with the case
[**usersUserIdCaseDocketNumberPendingPut**](CasesApi.md#usersUserIdCaseDocketNumberPendingPut) | **PUT** /users/{userId}/case/{docketNumber}/pending | add pending association for practitioner for case if not associated with the case
[**usersUserIdCasesGet**](CasesApi.md#usersUserIdCasesGet) | **GET** /users/{userId}/cases | get all cases for a user

<a name="caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost"></a>
# **caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost**
> ModelCase caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost(docketNumber, docketEntryId)

serves a court issued document

serves a court issued document 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdServeCourtIssuedPost(docketNumber, docketEntryId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdServePost"></a>
# **caseDocumentsDocketNumberDocketEntryIdServePost**
> Document caseDocumentsDocketNumberDocketEntryIdServePost(docketNumber, docketEntryId)

serves an externally-filed document

serves an externally-filed document 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdServePost(docketNumber, docketEntryId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**Document**](Document.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberAddPetitionerPut"></a>
# **caseMetaDocketNumberAddPetitionerPut**
> ModelCase caseMetaDocketNumberAddPetitionerPut(docketNumber)

adds a petitioner to the case

adds a petitioner to the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberAddPetitionerPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberBlockDelete"></a>
# **caseMetaDocketNumberBlockDelete**
> ModelCase caseMetaDocketNumberBlockDelete(docketNumber)

removed the block from a case

removed the block from a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberBlockDelete(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberBlockPost"></a>
# **caseMetaDocketNumberBlockPost**
> ModelCase caseMetaDocketNumberBlockPost(docketNumber)

add a block to a case

add a block to a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberBlockPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberCaseContextPut"></a>
# **caseMetaDocketNumberCaseContextPut**
> ModelCase caseMetaDocketNumberCaseContextPut(docketNumber)

Updates the caption, status, and judge on the given case.

Updates the caption, status, and judge on the given case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberCaseContextPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberConsolidateCaseDelete"></a>
# **caseMetaDocketNumberConsolidateCaseDelete**
> ModelCase caseMetaDocketNumberConsolidateCaseDelete(docketNumber, docketNumbersToRemove)

Unconsolidates the cases passed in the query string.

Unconsolidates the cases passed in the query string. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let docketNumbersToRemove = "docketNumbersToRemove_example"; // String | 

apiInstance.caseMetaDocketNumberConsolidateCaseDelete(docketNumber, docketNumbersToRemove, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **docketNumbersToRemove** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberConsolidateCasePut"></a>
# **caseMetaDocketNumberConsolidateCasePut**
> ModelCase caseMetaDocketNumberConsolidateCasePut(docketNumber)

Consolidates two or more cases associated with the given docket number.

Consolidates two or more cases associated with the given docket number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberConsolidateCasePut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberHighPriorityDelete"></a>
# **caseMetaDocketNumberHighPriorityDelete**
> ModelCase caseMetaDocketNumberHighPriorityDelete(docketNumber)

removes the high priority from a case

removes the high priority from a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberHighPriorityDelete(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberHighPriorityPost"></a>
# **caseMetaDocketNumberHighPriorityPost**
> ModelCase caseMetaDocketNumberHighPriorityPost(docketNumber)

sets a case as high priority

sets a case as high priority. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberHighPriorityPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberOtherStatisticsPost"></a>
# **caseMetaDocketNumberOtherStatisticsPost**
> ModelCase caseMetaDocketNumberOtherStatisticsPost(docketNumber)

update other statistics on a case

update other statistics on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberOtherStatisticsPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberQcCompletePut"></a>
# **caseMetaDocketNumberQcCompletePut**
> User caseMetaDocketNumberQcCompletePut(docketNumber, opts)

updates the case to be marked as QCed

updates the case to be marked as QCed. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let opts = { 
  'body': new DevEfCms.DocketNumberQccompleteBody() // DocketNumberQccompleteBody | the trial session info needed to identify and update a trial session
};
apiInstance.caseMetaDocketNumberQcCompletePut(docketNumber, opts, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **body** | [**DocketNumberQccompleteBody**](DocketNumberQccompleteBody.md)| the trial session info needed to identify and update a trial session | [optional] 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="caseMetaDocketNumberSealAddressContactIdPut"></a>
# **caseMetaDocketNumberSealAddressContactIdPut**
> ModelCase caseMetaDocketNumberSealAddressContactIdPut(docketNumber, contactId)

updates the specified case contact address as sealed

updates the case contact address as sealed. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let contactId = "contactId_example"; // String | 

apiInstance.caseMetaDocketNumberSealAddressContactIdPut(docketNumber, contactId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **contactId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberSealPut"></a>
# **caseMetaDocketNumberSealPut**
> ModelCase caseMetaDocketNumberSealPut(docketNumber)

updates the case as sealed

updates the case as sealed. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberSealPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseMetaDocketNumberStatisticsPost"></a>
# **caseMetaDocketNumberStatisticsPost**
> ModelCase caseMetaDocketNumberStatisticsPost(docketNumber)

add a statistic to a case

add a statistic to a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseMetaDocketNumberStatisticsPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberAssociatePrivatePractitionerPost"></a>
# **casePartiesDocketNumberAssociatePrivatePractitionerPost**
> User casePartiesDocketNumberAssociatePrivatePractitionerPost(docketNumber)

associates a practitioner with a case

associates a practitioner with a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberAssociatePrivatePractitionerPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberAssociateRespondentPost"></a>
# **casePartiesDocketNumberAssociateRespondentPost**
> User casePartiesDocketNumberAssociateRespondentPost(docketNumber)

associates a respondent with a case

associates a respondent with a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberAssociateRespondentPost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberCaseDetailsPut"></a>
# **casePartiesDocketNumberCaseDetailsPut**
> User casePartiesDocketNumberCaseDetailsPut(docketNumber)

updates the case details on the case

updates the case details on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberCaseDetailsPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberContactPrimaryPut"></a>
# **casePartiesDocketNumberContactPrimaryPut**
> ModelCase casePartiesDocketNumberContactPrimaryPut(docketNumber)

Updates the primary contact info on a case

Updates the primary contact info on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberContactPrimaryPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberContactSecondaryPut"></a>
# **casePartiesDocketNumberContactSecondaryPut**
> ModelCase casePartiesDocketNumberContactSecondaryPut(docketNumber)

Updates the secondary contact info on a case

Updates the secondary contact info on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberContactSecondaryPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberCounselUserIdDelete"></a>
# **casePartiesDocketNumberCounselUserIdDelete**
> ModelCase casePartiesDocketNumberCounselUserIdDelete(docketNumber, userId)

Deletes the counsel from the case

Deletes the counsel from the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let userId = "userId_example"; // String | 

apiInstance.casePartiesDocketNumberCounselUserIdDelete(docketNumber, userId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **userId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberCounselUserIdPut"></a>
# **casePartiesDocketNumberCounselUserIdPut**
> ModelCase casePartiesDocketNumberCounselUserIdPut(docketNumber, userId)

Updates the counsel on the case

Updates the counsel on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let userId = "userId_example"; // String | 

apiInstance.casePartiesDocketNumberCounselUserIdPut(docketNumber, userId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **userId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casePartiesDocketNumberPetitionerInfoPut"></a>
# **casePartiesDocketNumberPetitionerInfoPut**
> User casePartiesDocketNumberPetitionerInfoPut(docketNumber)

updates the petitioner information on the case

updates the petitioner information on the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casePartiesDocketNumberPetitionerInfoPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberConsolidatedCasesGet"></a>
# **casesDocketNumberConsolidatedCasesGet**
> ModelCase casesDocketNumberConsolidatedCasesGet(docketNumber)

Returns all consolidated cases associated with the given docket number.

Returns all consolidated cases associated with the given docket number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberConsolidatedCasesGet(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberGet"></a>
# **casesDocketNumberGet**
> ModelCase casesDocketNumberGet(docketNumber)

get a case by docket number

Get a case by docket number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberGet(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberHead"></a>
# **casesDocketNumberHead**
> ModelCase casesDocketNumberHead(docketNumber)

get a case existence by docket number

Get a case existence by docket number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberHead(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain

<a name="casesDocketNumberIrsPetitionPackageDelete"></a>
# **casesDocketNumberIrsPetitionPackageDelete**
> ModelCase casesDocketNumberIrsPetitionPackageDelete(docketNumber)

deletes the petition on the case from the holding queue

Deletes the petition on the case from the holding queue. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberIrsPetitionPackageDelete(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberIrsPetitionPackagePost"></a>
# **casesDocketNumberIrsPetitionPackagePost**
> ModelCase casesDocketNumberIrsPetitionPackagePost(docketNumber)

sends the case to the holding queue

Send a packaged case to the respondent. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberIrsPetitionPackagePost(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberPut"></a>
# **casesDocketNumberPut**
> ModelCase casesDocketNumberPut(docketNumber)

update a case

Update a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.casesDocketNumberPut(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberRemovePendingDocketEntryIdDelete"></a>
# **casesDocketNumberRemovePendingDocketEntryIdDelete**
> ModelCase casesDocketNumberRemovePendingDocketEntryIdDelete(docketNumber, docketEntryId)

removes a pending item from a case

removes a pending item from a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.casesDocketNumberRemovePendingDocketEntryIdDelete(docketNumber, docketEntryId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberStatisticsStatisticIdDelete"></a>
# **casesDocketNumberStatisticsStatisticIdDelete**
> ModelCase casesDocketNumberStatisticsStatisticIdDelete(docketNumber, statisticId)

removes a statistics entry off a case

removes a statistics entry off a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let statisticId = "statisticId_example"; // String | 

apiInstance.casesDocketNumberStatisticsStatisticIdDelete(docketNumber, statisticId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **statisticId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesDocketNumberStatisticsStatisticIdPut"></a>
# **casesDocketNumberStatisticsStatisticIdPut**
> ModelCase casesDocketNumberStatisticsStatisticIdPut(docketNumber, statisticId)

updates statistics on a case

updates statistics on a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 
let statisticId = "statisticId_example"; // String | 

apiInstance.casesDocketNumberStatisticsStatisticIdPut(docketNumber, statisticId, (error, data, response) => {
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
 **docketNumber** | **String**|  | 
 **statisticId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesGet"></a>
# **casesGet**
> ModelCase casesGet()

Retrieve open and closed cases for the currently authenticated user

Retrieve open and closed cases for the currently authenticated user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
apiInstance.casesGet((error, data, response) => {
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

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesPaperPost"></a>
# **casesPaperPost**
> ModelCase casesPaperPost()

create a case from a paper submission

Create a case from a paper submission. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
apiInstance.casesPaperPost((error, data, response) => {
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

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="casesSearchGet"></a>
# **casesSearchGet**
> ModelCase casesSearchGet()

search for a case by name, country, state, and/or year filed

Search for a case by name, country, state, and/or year filed. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
apiInstance.casesSearchGet((error, data, response) => {
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

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="irsPractitionersRespondentIdCasesGet"></a>
# **irsPractitionersRespondentIdCasesGet**
> ModelCase irsPractitionersRespondentIdCasesGet(respondentId)

get all cases for a user

Get all cases for a user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let respondentId = "respondentId_example"; // String | 

apiInstance.irsPractitionersRespondentIdCasesGet(respondentId, (error, data, response) => {
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
 **respondentId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiCasesDocketNumberGet"></a>
# **publicApiCasesDocketNumberGet**
> ModelCase publicApiCasesDocketNumberGet(docketNumber)

get a case by docket number

Get a case by docket number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.publicApiCasesDocketNumberGet(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiDocketNumberSearchDocketNumberGet"></a>
# **publicApiDocketNumberSearchDocketNumberGet**
> ModelCase publicApiDocketNumberSearchDocketNumberGet(docketNumber)

get a case by docket number

Get a case by docketNumber. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.publicApiDocketNumberSearchDocketNumberGet(docketNumber, (error, data, response) => {
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
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="publicApiSearchGet"></a>
# **publicApiSearchGet**
> ModelCase publicApiSearchGet()

search for a case by name, country, state, and/or year filed

Search for a case by name, country, state, and/or year filed. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
apiInstance.publicApiSearchGet((error, data, response) => {
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

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="reportsBlockedTrialLocationGet"></a>
# **reportsBlockedTrialLocationGet**
> ModelCase reportsBlockedTrialLocationGet(trialLocation)

get all blocked cases

get all blocked cases. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let trialLocation = "trialLocation_example"; // String | 

apiInstance.reportsBlockedTrialLocationGet(trialLocation, (error, data, response) => {
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
 **trialLocation** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="reportsCaseInventoryReportGet"></a>
# **reportsCaseInventoryReportGet**
> ModelCase reportsCaseInventoryReportGet(opts)

get case inventory report

get case inventory report. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let opts = { 
  'associatedJudge': "associatedJudge_example", // String | 
  'from': 1.2, // Number | 
  'pageSize': 1.2, // Number | 
  'status': "status_example" // String | 
};
apiInstance.reportsCaseInventoryReportGet(opts, (error, data, response) => {
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
 **associatedJudge** | **String**|  | [optional] 
 **from** | **Number**|  | [optional] 
 **pageSize** | **Number**|  | [optional] 
 **status** | **String**|  | [optional] 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="reportsPrintableCaseInventoryReportGet"></a>
# **reportsPrintableCaseInventoryReportGet**
> ModelCase reportsPrintableCaseInventoryReportGet(opts)

generate printable case inventory report

generate printable case inventory report. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let opts = { 
  'associatedJudge': "associatedJudge_example", // String | 
  'status': "status_example" // String | 
};
apiInstance.reportsPrintableCaseInventoryReportGet(opts, (error, data, response) => {
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
 **associatedJudge** | **String**|  | [optional] 
 **status** | **String**|  | [optional] 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="usersUserIdCaseDocketNumberPendingGet"></a>
# **usersUserIdCaseDocketNumberPendingGet**
> usersUserIdCaseDocketNumberPendingGet(userId, docketNumber)

verify if user has pending association with the case

Verify if user has pending associationwith the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let userId = "userId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.usersUserIdCaseDocketNumberPendingGet(userId, docketNumber, (error, data, response) => {
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

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdCaseDocketNumberPendingPut"></a>
# **usersUserIdCaseDocketNumberPendingPut**
> usersUserIdCaseDocketNumberPendingPut(userId, docketNumber)

add pending association for practitioner for case if not associated with the case

Add pending association for practitioner for case if not associated with the case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let userId = "userId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.usersUserIdCaseDocketNumberPendingPut(userId, docketNumber, (error, data, response) => {
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

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="usersUserIdCasesGet"></a>
# **usersUserIdCasesGet**
> ModelCase usersUserIdCasesGet(userId)

get all cases for a user

Get all cases for a user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CasesApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdCasesGet(userId, (error, data, response) => {
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
 **userId** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

