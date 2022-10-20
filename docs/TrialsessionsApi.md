# DevEfCms.TrialsessionsApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**trialSessionsGet**](TrialsessionsApi.md#trialSessionsGet) | **GET** /trial-sessions | gets all trial sessions
[**trialSessionsPost**](TrialsessionsApi.md#trialSessionsPost) | **POST** /trial-sessions | creates a new trial session
[**trialSessionsPut**](TrialsessionsApi.md#trialSessionsPut) | **PUT** /trial-sessions | updates a trial session
[**trialSessionsTrialSessionIdCasesDocketNumberPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdCasesDocketNumberPost) | **POST** /trial-sessions/{trialSessionId}/cases/{docketNumber} | adds a case to a trial session
[**trialSessionsTrialSessionIdEligibleCasesGet**](TrialsessionsApi.md#trialSessionsTrialSessionIdEligibleCasesGet) | **GET** /trial-sessions/{trialSessionId}/eligible-cases | gets eligible cases for a trial session
[**trialSessionsTrialSessionIdGenerateNoticesPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdGenerateNoticesPost) | **POST** /trial-sessions/{trialSessionId}/generate-notices | generates notices of trial and standing pretrial document for cases within a given trial session and returns a PDF for any paper service parties associated
[**trialSessionsTrialSessionIdGet**](TrialsessionsApi.md#trialSessionsTrialSessionIdGet) | **GET** /trial-sessions/{trialSessionId} | gets a trial session
[**trialSessionsTrialSessionIdGetAssociatedCasesGet**](TrialsessionsApi.md#trialSessionsTrialSessionIdGetAssociatedCasesGet) | **GET** /trial-sessions/{trialSessionId}/getAssociatedCases | gets the cases associated with a trial session
[**trialSessionsTrialSessionIdPrintableWorkingCopyPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdPrintableWorkingCopyPost) | **POST** /trial-sessions/{trialSessionId}/printable-working-copy | generates a printable trial session copy report
[**trialSessionsTrialSessionIdRemoveCaseDocketNumberPut**](TrialsessionsApi.md#trialSessionsTrialSessionIdRemoveCaseDocketNumberPut) | **PUT** /trial-sessions/{trialSessionId}/remove-case/{docketNumber} | removes a case from a trial session
[**trialSessionsTrialSessionIdSetCalendarPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdSetCalendarPost) | **POST** /trial-sessions/{trialSessionId}/set-calendar | sets the calendar for a trial session
[**trialSessionsTrialSessionIdSetHearingDocketNumberPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdSetHearingDocketNumberPost) | **POST** /trial-sessions/{trialSessionId}/set-hearing/{docketNumber} | adds the case to the given hearing
[**trialSessionsTrialSessionIdSetSwingSessionPost**](TrialsessionsApi.md#trialSessionsTrialSessionIdSetSwingSessionPost) | **POST** /trial-sessions/{trialSessionId}/set-swing-session | sets a trial session as a swing session
[**trialSessionsTrialSessionIdWorkingCopyGet**](TrialsessionsApi.md#trialSessionsTrialSessionIdWorkingCopyGet) | **GET** /trial-sessions/{trialSessionId}/working-copy | gets the trial session working copy for a trial session for the logged in user
[**trialSessionsTrialSessionIdWorkingCopyPut**](TrialsessionsApi.md#trialSessionsTrialSessionIdWorkingCopyPut) | **PUT** /trial-sessions/{trialSessionId}/working-copy | updates the trial session working copy for a trial session for the logged in user

<a name="trialSessionsGet"></a>
# **trialSessionsGet**
> TrialSession trialSessionsGet()

gets all trial sessions

gets all trial sessions. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
apiInstance.trialSessionsGet((error, data, response) => {
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

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsPost"></a>
# **trialSessionsPost**
> TrialSession trialSessionsPost()

creates a new trial session

creates a new trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
apiInstance.trialSessionsPost((error, data, response) => {
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

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsPut"></a>
# **trialSessionsPut**
> TrialSession trialSessionsPut()

updates a trial session

updates a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
apiInstance.trialSessionsPut((error, data, response) => {
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

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdCasesDocketNumberPost"></a>
# **trialSessionsTrialSessionIdCasesDocketNumberPost**
> ModelCase trialSessionsTrialSessionIdCasesDocketNumberPost(trialSessionId, docketNumber)

adds a case to a trial session

adds a case to a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdCasesDocketNumberPost(trialSessionId, docketNumber, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdEligibleCasesGet"></a>
# **trialSessionsTrialSessionIdEligibleCasesGet**
> TrialSession trialSessionsTrialSessionIdEligibleCasesGet(trialSessionId)

gets eligible cases for a trial session

gets eligible cases for a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdEligibleCasesGet(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdGenerateNoticesPost"></a>
# **trialSessionsTrialSessionIdGenerateNoticesPost**
> trialSessionsTrialSessionIdGenerateNoticesPost(trialSessionId)

generates notices of trial and standing pretrial document for cases within a given trial session and returns a PDF for any paper service parties associated

generates notices of trial and standing pretrial document for cases within a given trial session and returns a PDF for any paper service parties associated. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdGenerateNoticesPost(trialSessionId, (error, data, response) => {
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

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="trialSessionsTrialSessionIdGet"></a>
# **trialSessionsTrialSessionIdGet**
> TrialSession trialSessionsTrialSessionIdGet(trialSessionId)

gets a trial session

gets a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdGet(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdGetAssociatedCasesGet"></a>
# **trialSessionsTrialSessionIdGetAssociatedCasesGet**
> TrialSession trialSessionsTrialSessionIdGetAssociatedCasesGet(trialSessionId)

gets the cases associated with a trial session

gets the cases associated with a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdGetAssociatedCasesGet(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdPrintableWorkingCopyPost"></a>
# **trialSessionsTrialSessionIdPrintableWorkingCopyPost**
> &#x27;String&#x27; trialSessionsTrialSessionIdPrintableWorkingCopyPost(trialSessionId, opts)

generates a printable trial session copy report

generates a printable trial session copy report . 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 
let opts = { 
  'body': new DevEfCms.TrialSessionIdPrintableworkingcopyBody() // TrialSessionIdPrintableworkingcopyBody | the trial session info needed to print a working copy
};
apiInstance.trialSessionsTrialSessionIdPrintableWorkingCopyPost(trialSessionId, opts, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 
 **body** | [**TrialSessionIdPrintableworkingcopyBody**](TrialSessionIdPrintableworkingcopyBody.md)| the trial session info needed to print a working copy | [optional] 

### Return type

**&#x27;String&#x27;**

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: text/plain

<a name="trialSessionsTrialSessionIdRemoveCaseDocketNumberPut"></a>
# **trialSessionsTrialSessionIdRemoveCaseDocketNumberPut**
> ModelCase trialSessionsTrialSessionIdRemoveCaseDocketNumberPut(trialSessionId, docketNumber)

removes a case from a trial session

removes a case from a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdRemoveCaseDocketNumberPut(trialSessionId, docketNumber, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

[**ModelCase**](ModelCase.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdSetCalendarPost"></a>
# **trialSessionsTrialSessionIdSetCalendarPost**
> TrialSession trialSessionsTrialSessionIdSetCalendarPost(trialSessionId)

sets the calendar for a trial session

sets the calendar for a trial session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetCalendarPost(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdSetHearingDocketNumberPost"></a>
# **trialSessionsTrialSessionIdSetHearingDocketNumberPost**
> TrialSession trialSessionsTrialSessionIdSetHearingDocketNumberPost(trialSessionId, docketNumber)

adds the case to the given hearing

adds the case to the given hearing. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 
let docketNumber = "docketNumber_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetHearingDocketNumberPost(trialSessionId, docketNumber, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 
 **docketNumber** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdSetSwingSessionPost"></a>
# **trialSessionsTrialSessionIdSetSwingSessionPost**
> TrialSession trialSessionsTrialSessionIdSetSwingSessionPost(trialSessionId)

sets a trial session as a swing session

sets a trial session as a swing session. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdSetSwingSessionPost(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdWorkingCopyGet"></a>
# **trialSessionsTrialSessionIdWorkingCopyGet**
> TrialSessionWorkingCopy trialSessionsTrialSessionIdWorkingCopyGet(trialSessionId)

gets the trial session working copy for a trial session for the logged in user

gets the trial session working copy for a trial session for the logged in user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdWorkingCopyGet(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSessionWorkingCopy**](TrialSessionWorkingCopy.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="trialSessionsTrialSessionIdWorkingCopyPut"></a>
# **trialSessionsTrialSessionIdWorkingCopyPut**
> TrialSessionWorkingCopy trialSessionsTrialSessionIdWorkingCopyPut(trialSessionId)

updates the trial session working copy for a trial session for the logged in user

updates the trial session working copy for a trial session for the logged in user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.TrialsessionsApi();
let trialSessionId = "trialSessionId_example"; // String | 

apiInstance.trialSessionsTrialSessionIdWorkingCopyPut(trialSessionId, (error, data, response) => {
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
 **trialSessionId** | **String**|  | 

### Return type

[**TrialSessionWorkingCopy**](TrialSessionWorkingCopy.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

