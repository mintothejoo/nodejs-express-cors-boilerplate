import { __object, __acl } from './../helpers/parse';

import Pos from './../entity/Pos';
import Stores from './../entity/Store';
import Merchant from './../entity/Merchant';
import MerchantAccountInfo from '../entity/MerchantAccountInfo';
import Transaction from './../entity/Transaction';
import User from '../entity/User';

export const __create = async (entityData, table, roleName, isDemo) => {
  try {
    let entityType = '';
    let acl = __acl(false, roleName);
    acl.setPublicWriteAccess(false);
    switch (table) {
      case 'POS':
        entityType = new Pos(entityData);
        break;
      case 'Merchant':
        if (isDemo) {
          roleName = 'demo' + roleName;
          entityData.roleName = roleName;
          entityData.vendorName = 'demo' + entityData.vendorName;
        }
        entityType = new Merchant(entityData);
        break;
      case 'Store':
        entityType = new Stores(entityData);
        break;
      case 'MerchantAccountInfo':
        entityType = new MerchantAccountInfo(entityData);
        acl = __acl(true, roleName, [{ value: true, name: 'merchant', type: 'both' }]);
        break;
      case 'User':
        entityType = new User(entityData);
        if (isDemo && !entityData.accountType === 'POS') {
          // entityType = entityType.set('emailVerified', true);
          // entityType = entityType.set('IsTermsAccepted', true);
        } else if (entityData.accountType === 'POS') {
        }
        break;
      case 'Transaction':
        entityType = new Transaction(entityData);
        acl = __acl(true);
        acl.setReadAccess(entityData.userId, true);
        acl.setWriteAccess(entityData.userId, true);
    }
    const object = __object(table);
    object.setACL(acl, {});
    object.set({ ...entityType.data });
    // for saving its own object id as the ACL, we need a saved instance of this object to retrieve
    // the object id!
    if (roleName === null) {
      const savedObject = await object.save(null, { useMasterKey: true });
      console.log("saved Object",roleName , savedObject)
      acl = __acl(false, null);
      acl.setPublicWriteAccess(false);
      acl.setWriteAccess(savedObject.id, true);
      savedObject.setACL(acl, {});
      return savedObject.save(null, { useMasterKey: true });
    }
    return object.save(null, { useMasterKey: true });
  } catch (error) {
    return error;
  }
};

// export const __createPos = (data, roleName, isDemo) => {
//   try {
//     const pos = new Pos(data.pos);
//     const roleName = data.roleName;
//     const acl = __acl(false, roleName);
//     acl.setPublicWriteAccess(false);
//     return __create(pos, 'POS', acl, roleName);
//   } catch (error) {
//     return error;
//   }
// };

// export const __createStore = (data, roleName, isDemo) => {
//   try {
//     const store = new Stores(data.store);
//     const roleName = data.roleName;
//     const acl = __acl(false, roleName);
//     acl.setPublicWriteAccess(false);
//     return __create(store, 'Store', acl, roleName);
//   } catch (error) {
//     return error;
//   }
// };

// export const __createMerchantTable = (mData, roleName, isDemo) => {
//   try {
//     if (isDemo) {
//       roleName = 'demo-' + roleName;
//       mData.roleName = roleName;
//       mData.vendorName = 'demo-' + mData.vendorName;
//     }
//     const merchant = new Merchant(mData);
//     const acl = __acl(false, roleName);
//     acl.setPublicWriteAccess(false);
//     return __create(merchant, 'Merchant', acl, roleName);
//   } catch (error) {
//     return error;
//   }
// };
