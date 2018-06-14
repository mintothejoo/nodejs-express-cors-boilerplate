import request from 'superagent';
import config from './config/config';

const __getUrl = (protocol, host, prefix, path) => {
  let parts = [];

  if (!protocol) {
    protocol = 'http';
  }

  parts.push(protocol + ':/');
  parts.push(host);

  if (prefix) {
    parts.push(prefix);
  }

  parts.push(path);

  return parts.join('/');
};

export const __getHost = path => {
  if (path.indexOf('http') === 0) {
    return path;
  }

  let pathParent = path.split('/')[0];

  if (Object.keys(config.alias).indexOf(pathParent) > -1) {
    if (typeof config.alias[pathParent] === 'string') {
      return __getUrl(config.alias[pathParent], '', path);
    }
    return __getUrl(config.alias[pathParent].protocol, config.alias[pathParent].host, config.alias[pathParent].prefix, path);
  }

  return [config.alias[''], path].join('/');
};

export const get = (path, params, headers) => {
  return new Promise((resolve, reject) => {
    let rq = request
      .get(__getHost(path))
      .withCredentials()
      .accept('json')
      .query(params);

    if (headers) {
      for (let header in headers) {
        rq.set(header, headers[header]);
      }
    }
    console.log(rq);

    rq.end((err, res) => {
      if (err) {
        reject(err, res);
      } else {
        resolve(res);
      }
    });
  });
};

export const __post = (path, data, headers) => {
  return new Promise((resolve, reject) => {
    if (path.indexOf('http') < 0) {
      path = __getHost(path);
    }

    let call = request
      .post(path, data)
      .withCredentials()
      .accept('json');

    Object.keys(headers).map(header => {
      call.set(header, headers[header]);
    });

    call.end((err, res) => {
      if (err) {
        reject(err, res);
      } else {
        resolve(res);
      }
    });
  });
};
