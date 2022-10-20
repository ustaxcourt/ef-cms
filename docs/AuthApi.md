# DevEfCms.AuthApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authLoginDelete**](AuthApi.md#authLoginDelete) | **DELETE** /auth/login | expires the refreshToken cookie by setting an old expiration date
[**authLoginPost**](AuthApi.md#authLoginPost) | **POST** /auth/login | uses the oauth2 authorization code to generate a refresh and access token
[**authRefreshPost**](AuthApi.md#authRefreshPost) | **POST** /auth/refresh | uses the provided refreshToken cookie to generate a new access token

<a name="authLoginDelete"></a>
# **authLoginDelete**
> authLoginDelete()

expires the refreshToken cookie by setting an old expiration date

Expires the refreshToken cookie by setting an old expiration date. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.AuthApi();
apiInstance.authLoginDelete((error, data, response) => {
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

<a name="authLoginPost"></a>
# **authLoginPost**
> Authorization authLoginPost(opts)

uses the oauth2 authorization code to generate a refresh and access token

Uses the oauth2 authorization code to generate a refresh and access token. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.AuthApi();
let opts = { 
  'body': new DevEfCms.AuthLoginBody() // AuthLoginBody | the oauth2 authorization code
};
apiInstance.authLoginPost(opts, (error, data, response) => {
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
 **body** | [**AuthLoginBody**](AuthLoginBody.md)| the oauth2 authorization code | [optional] 

### Return type

[**Authorization**](Authorization.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="authRefreshPost"></a>
# **authRefreshPost**
> Authorization authRefreshPost(cookie)

uses the provided refreshToken cookie to generate a new access token

Uses the provided refreshToken cookie to generate a new access token. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.AuthApi();
let cookie = "cookie_example"; // String | the refreshToken cookie

apiInstance.authRefreshPost(cookie, (error, data, response) => {
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
 **cookie** | **String**| the refreshToken cookie | 

### Return type

[**Authorization**](Authorization.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

