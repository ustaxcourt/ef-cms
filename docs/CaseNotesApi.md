# DevEfCms.CaseNotesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**caseNotesDocketNumberDelete**](CaseNotesApi.md#caseNotesDocketNumberDelete) | **DELETE** /case-notes/{docketNumber} | delete the case procedural note
[**caseNotesDocketNumberPut**](CaseNotesApi.md#caseNotesDocketNumberPut) | **PUT** /case-notes/{docketNumber} | update a case procedural note
[**caseNotesDocketNumberUserNotesDelete**](CaseNotesApi.md#caseNotesDocketNumberUserNotesDelete) | **DELETE** /case-notes/{docketNumber}/user-notes | delete the user&#x27;s note for the logged in user
[**caseNotesDocketNumberUserNotesGet**](CaseNotesApi.md#caseNotesDocketNumberUserNotesGet) | **GET** /case-notes/{docketNumber}/user-notes | gets the logged in user&#x27;s note for a case
[**caseNotesDocketNumberUserNotesPost**](CaseNotesApi.md#caseNotesDocketNumberUserNotesPost) | **POST** /case-notes/{docketNumber}/user-notes | create and associate a note to a case for the logged in user
[**caseNotesDocketNumberUserNotesPut**](CaseNotesApi.md#caseNotesDocketNumberUserNotesPut) | **PUT** /case-notes/{docketNumber}/user-notes | update a user&#x27;s note for the logged in user

<a name="caseNotesDocketNumberDelete"></a>
# **caseNotesDocketNumberDelete**
> CaseNote caseNotesDocketNumberDelete(docketNumber)

delete the case procedural note

delete the case procedural note. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberDelete(docketNumber, (error, data, response) => {
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

[**CaseNote**](CaseNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseNotesDocketNumberPut"></a>
# **caseNotesDocketNumberPut**
> CaseNote caseNotesDocketNumberPut(docketNumber)

update a case procedural note

update a case procedural note. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberPut(docketNumber, (error, data, response) => {
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

[**CaseNote**](CaseNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseNotesDocketNumberUserNotesDelete"></a>
# **caseNotesDocketNumberUserNotesDelete**
> UserNote caseNotesDocketNumberUserNotesDelete(docketNumber)

delete the user&#x27;s note for the logged in user

delete the user&#x27;s note for the logged in user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberUserNotesDelete(docketNumber, (error, data, response) => {
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

[**UserNote**](UserNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseNotesDocketNumberUserNotesGet"></a>
# **caseNotesDocketNumberUserNotesGet**
> UserNote caseNotesDocketNumberUserNotesGet(docketNumber)

gets the logged in user&#x27;s note for a case

gets the logged in user&#x27;s note for a case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberUserNotesGet(docketNumber, (error, data, response) => {
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

[**UserNote**](UserNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseNotesDocketNumberUserNotesPost"></a>
# **caseNotesDocketNumberUserNotesPost**
> UserNote caseNotesDocketNumberUserNotesPost(docketNumber)

create and associate a note to a case for the logged in user

create and associate a note to a case for the logged in user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberUserNotesPost(docketNumber, (error, data, response) => {
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

[**UserNote**](UserNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseNotesDocketNumberUserNotesPut"></a>
# **caseNotesDocketNumberUserNotesPut**
> UserNote caseNotesDocketNumberUserNotesPut(docketNumber)

update a user&#x27;s note for the logged in user

update a user&#x27;s note for the logged in user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.CaseNotesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.caseNotesDocketNumberUserNotesPut(docketNumber, (error, data, response) => {
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

[**UserNote**](UserNote.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

