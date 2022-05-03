const axios = require('axios');
const { aws4Interceptor } = require('aws4-axios');

let baseurl = process.env.ApiBaseUrl;
const region = process.env.AWS_REGION || 'eu-west-1';

const interceptor = aws4Interceptor({
  region,
  service: "execute-api",
});

axios.interceptors.request.use(interceptor);

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

const post = async (path, data) => {
  const request = buildRequest('POST', path, data);
  return axios(request);
};

const get = async path => {
  const request = buildRequest('GET', path);
  return axios(request);
};

const remove = async path => {
  const request = buildRequest('DELETE', path);
  return axios(request);
};

const put = async (path, data) => {
  const request = buildRequest('PUT', path, data);
  return axios(request);
};

module.exports = {
  post,
  get,
  remove,
  put
};
