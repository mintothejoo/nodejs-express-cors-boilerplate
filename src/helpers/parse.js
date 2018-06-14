import Parse from 'parse/node';

export const __query = ObjectName => {
  return new Parse.Query(Parse.Object.extend(ObjectName));
};

export const __object = ObjectName => {
  const ob = Parse.Object.extend(ObjectName);
  return new ob();
};

export const __geoPoint = (lat, lng) => {
  return new Promise(resolve => resolve(new Parse.GeoPoint(lat, lng)));
};

export const __run = (action, data, auth) => {
  return Parse.Cloud.run(action, data, auth);
};

export const __relation = (parrent, key) => {
  const ob = Parse.Object.relation(parrent, key);
};

export const __get = (className, id) => {
  if (typeof id === 'object' && id.hasOwnProperty('objectId')) {
    id = id.objectId;
  }

  return __query(className).get(id);
};

export const __saveAll = objects => {
  return Parse.Object.saveAll(objects, { useMasterKey: true });
};

export const __file = file => {
  return new Promise((resolve, reject) => {
    let file_data = { base64: file.url };
    let parseFile = new Parse.File(file.name, file_data, file.type);

    parseFile
      .save()
      .then(() => {
        console.log('Saving File.....');
        resolve(parseFile);
      })
      .catch(reject);
  });
};

export const __role = name => {
  return __query(Parse.Role)
    .equalTo('name', name)
    .first({ useMasterKey: true });
    
};

export const __roles = async names => {
  console.log('im names', names);
  let roles = [];
  await names.forEach(name => {
    roles.push(
        __query(Parse.Role)
        .equalTo('name', name)
        .first({ useMasterKey: true })
    );
  });
  await console.log('im roooles', roles);
  return Promise.all(roles);
};

export const __acl = (isPrivate, merchant, access, oldAcl) => {
  let acl = oldAcl ? oldAcl : new Parse.ACL();

  if (isPrivate) {
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
  } else {
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(true);
  }

  if (access) {
    merchant = merchant.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    access.forEach(role => {
      let roleName = merchant + '-' + role.name;
      if (role.type === 'both') {
        acl.setRoleWriteAccess(roleName, role.value);
        acl.setRoleReadAccess(roleName, role.value);
      } else if (role.type === 'write') {
        acl.setRoleWriteAccess(roleName, role.value);
      } else {
        acl.setRoleReadAccess(roleName, role.value);
      }
    });
  }

  return acl;
};
