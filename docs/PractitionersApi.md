# DevEfCms.PractitionersApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**practitionersBarNumberGet**](PractitionersApi.md#practitionersBarNumberGet) | **GET** /practitioners/{barNumber} | get the practitioner via bar number
[**practitionersBarNumberPut**](PractitionersApi.md#practitionersBarNumberPut) | **PUT** /practitioners/{barNumber} | updates a practitioner user
[**practitionersGet**](PractitionersApi.md#practitionersGet) | **GET** /practitioners | gets a practitioner by name
[**practitionersPost**](PractitionersApi.md#practitionersPost) | **POST** /practitioners | creates a practitioner user
[**practitionersUserIdPrintableCaseListGet**](PractitionersApi.md#practitionersUserIdPrintableCaseListGet) | **GET** /practitioners/{userId}/printable-case-list | generates a printable case list for the practitioner userId provided

<a name="practitionersBarNumberGet"></a>
# **practitionersBarNumberGet**
> User practitionersBarNumberGet(barNumber)

get the practitioner via bar number

Get the practitioner via bar number. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.PractitionersApi();
let barNumber = "barNumber_example"; // String | 

apiInstance.practitionersBarNumberGet(barNumber, (error, data, response) => {
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
 **barNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="practitionersBarNumberPut"></a>
# **practitionersBarNumberPut**
> User practitionersBarNumberPut(barNumber)

updates a practitioner user

updates a practitioner user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.PractitionersApi();
let barNumber = "barNumber_example"; // String | 

apiInstance.practitionersBarNumberPut(barNumber, (error, data, response) => {
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
 **barNumber** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="practitionersGet"></a>
# **practitionersGet**
> User practitionersGet(name)

gets a practitioner by name

Gets a practitioner by name. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.PractitionersApi();
let name = "name_example"; // String | 

apiInstance.practitionersGet(name, (error, data, response) => {
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
 **name** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="practitionersPost"></a>
# **practitionersPost**
> User practitionersPost(name)

creates a practitioner user

creates a practitioner user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.PractitionersApi();
let name = "name_example"; // String | 

apiInstance.practitionersPost(name, (error, data, response) => {
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
 **name** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="practitionersUserIdPrintableCaseListGet"></a>
# **practitionersUserIdPrintableCaseListGet**
> File practitionersUserIdPrintableCaseListGet(userId)

generates a printable case list for the practitioner userId provided

Generates a printable case list for the practitioner userId provided. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.PractitionersApi();
let userId = "userId_example"; // String | 

apiInstance.practitionersUserIdPrintableCaseListGet(userId, (error, data, response) => {
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

**File**

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

