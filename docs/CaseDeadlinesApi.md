# DevEfCms.CaseDeadlinesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseDeadlinesDocketNumberCaseDeadlineIdDelete**](CaseDeadlinesApi.md#caseDeadlinesDocketNumberCaseDeadlineIdDelete) | **DELETE** /case-deadlines/{docketNumber}/{caseDeadlineId} | delete a case deadline
[**caseDeadlinesDocketNumberCaseDeadlineIdPut**](CaseDeadlinesApi.md#caseDeadlinesDocketNumberCaseDeadlineIdPut) | **PUT** /case-deadlines/{docketNumber}/{caseDeadlineId} | updates a case deadline
[**caseDeadlinesDocketNumberGet**](CaseDeadlinesApi.md#caseDeadlinesDocketNumberGet) | **GET** /case-deadlines/{docketNumber} | gets deadlines for a case
[**caseDeadlinesDocketNumberPost**](CaseDeadlinesApi.md#caseDeadlinesDocketNumberPost) | **POST** /case-deadlines/{docketNumber} | create and associate a deadline to a case
[**caseDeadlinesGet**](CaseDeadlinesApi.md#caseDeadlinesGet) | **GET** /case-deadlines | get all case deadlines

<a name="caseDeadlinesDocketNumberCaseDeadlineIdDelete"></a>
# **caseDeadlinesDocketNumberCaseDeadlineIdDelete**
> caseDeadlinesDocketNumberCaseDeadlineIdDelete(docketNumber, caseDeadlineId)

delete a case deadline

delete a case deadline. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDeadlinesApi();
let docketNumber = "docketNumber_example"; // String | 
let caseDeadlineId = "caseDeadlineId_example"; // String | 

apiInstance.caseDeadlinesDocketNumberCaseDeadlineIdDelete(docketNumber, caseDeadlineId, (error, data, response) => {
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

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDeadlinesDocketNumberCaseDeadlineIdPut"></a>
# **caseDeadlinesDocketNumberCaseDeadlineIdPut**
> TrialSession caseDeadlinesDocketNumberCaseDeadlineIdPut(docketNumber, caseDeadlineId)

updates a case deadline

updates a case deadline. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDeadlinesApi();
let docketNumber = "docketNumber_example"; // String | 
let caseDeadlineId = "caseDeadlineId_example"; // String | 

apiInstance.caseDeadlinesDocketNumberCaseDeadlineIdPut(docketNumber, caseDeadlineId, (error, data, response) => {
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
 **caseDeadlineId** | **String**|  | 

### Return type

[**TrialSession**](TrialSession.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDeadlinesDocketNumberGet"></a>
# **caseDeadlinesDocketNumberGet**
> CaseDeadline caseDeadlinesDocketNumberGet(docketNumber)

gets deadlines for a case

gets deadlines for a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDeadlinesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDeadlinesDocketNumberGet(docketNumber, (error, data, response) => {
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

[**CaseDeadline**](CaseDeadline.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDeadlinesDocketNumberPost"></a>
# **caseDeadlinesDocketNumberPost**
> CaseDeadline caseDeadlinesDocketNumberPost(docketNumber)

create and associate a deadline to a case

create and associate a deadline to a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDeadlinesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseDeadlinesDocketNumberPost(docketNumber, (error, data, response) => {
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

[**CaseDeadline**](CaseDeadline.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDeadlinesGet"></a>
# **caseDeadlinesGet**
> CaseDeadline caseDeadlinesGet()

get all case deadlines

get all case deadlines. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseDeadlinesApi();
apiInstance.caseDeadlinesGet((error, data, response) => {
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

[**CaseDeadline**](CaseDeadline.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

