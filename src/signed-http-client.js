const axios = require('axios');
const aws4 = require('aws4');

let baseurl = process.env.ApiBaseUrl;
const region = process.env.AWS_REGION || 'eu-west-1';

const buildRequest = (method, path, data) => {
  if (!baseurl) {
    throw Error('Environment variable "ApiBaseUrl" is not set!');
  }

  if (baseurl.startsWith('https://')) {
    baseurl = baseurl.replace('https://', '');
  }

  let apiPath = path;

  if (path.startsWith('/')) {
    apiPath = apiPath.substr(1);
  }

  const request = {
    host: baseurl,
    method,
    url: `https://${baseurl}/${apiPath}`,
    path,
    region,
    headers: {
      'content-type': 'application/json'
    },
    service: 'execute-api'
  };

  if (data) {
    const body = JSON.stringify(data);
    request.data = data;
    request.body = body;
  }

  return request;
};

const signRequest = request => {
  const signedRequest = aws4.sign(request);
  delete signedRequest.headers.Host;
  delete signedRequest.headers['Content-Length'];
  return signedRequest;
};

const post = async (path, data) => {
  const request = buildRequest('POST', path, data);
  const signedRequest = signRequest(request);
  return axios(signedRequest);
};

const get = async path => {
  const request = buildRequest('GET', path);
  const signedRequest = signRequest(request);
  return axios(signedRequest);
};

const remove = async path => {
  const request = buildRequest('DELETE', path);
  const signedRequest = signRequest(request);
  return axios(signedRequest);
};

const put = async path => {
  const request = buildRequest('PUT', path);
  const signedRequest = signRequest(request);
  return axios(signedRequest);
};

module.exports = {
  post,
  get,
  remove,
  put
};
