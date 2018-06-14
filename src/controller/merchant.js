import Parse from 'parse/node';
import cheerio from 'cheerio';
import fs from 'fs';
import Merchant from '../entity/Merchant';
import { _checkMerchantFiles } from '../domain/merchant';
import { __groupBy } from './../helpers/groupBy';
import { __query, __file } from './../helpers/parse';
import { __getDate, __subDaysFromDate } from './../helpers/date';
import { __sortByNumberOnKey } from './../helpers/sort';
import { __sendMail } from './../helpers/mailer';
import { _verifyState } from './../helpers/state';
import { get } from './../request';

export const getProfile = async (req, res, next) => {
  try {
    let [merchant, demopos] = await Promise.all([
      __query('Merchant').get(req.user.merchantId.objectId, {
        sessionToken: req.user.sessionToken,
      }),
      __query('POS')
        .equalTo('merchantId', req.user.demoMerchantId)
        .first({ useMasterKey: true }),
    ]);
    if (demopos) {
      merchant.set('qrCode', demopos.get('qrCode'));
    }
    return res.json(merchant);
  } catch (error) {
    return res.json(error);
  }
};

export const getAccountInfo = async (req, res, next) => {
  try {
    const merchantInfo = await __query('MerchantAccountInfo')
      .equalTo('merchantId', req.user.merchantId)
      .first({ sessionToken: req.user.sessionToken });
    console.log('asdfasdfasdf', merchantInfo);
    return await res.json({
      user: req.user,
      accountInfo: merchantInfo,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getState = async (req, res, next) => {
  try {
    const devState = ['ACCOUNT_ACTIVATE', 'ACCOUNT_PAYMENT', 'POS_SELECTION', 'SETUP_PROFILE','ACCOUNT_COMPLETE'];
    const prodState = [
      'ACCOUNT_ACTIVATE',
      'ACCOUNT_PAYMENT',
      'POS_SELECTION',
      'SETUP_PROFILE',
      'SETUP_OFFER',
      'SETUP_NEWSLETTER',
      'SETUP_RECOGNITION',
      'ACCOUNT_COMPLETE',
    ];
    var state = devState;
    const merchantAccount = await __query('MerchantAccountInfo')
      .equalTo('merchantId', req.user.merchantId)
      .first({ sessionToken: req.user.sessionToken });
    const merchantAcc = await _verifyState(merchantAccount, state, req.body);
    const newMerchantAccount = await merchantAcc.save(null, {
      sessionToken: req.user.sessionToken,
    });
    console.log('State - Saved Merchant Info');
    return res.json({ newMerchantAccount, stage: merchantAcc.get('accountState') });
  } catch (error) {
    console.log('iam errror', error);
  }
};

export const setupPos = async (req, res, next) => {
  try {
    console.log('fsakjflkas flasl', req.body);
    const accountInfo = await __query('MerchantAccountInfo')
      .equalTo('merchantId', req.user.merchantId)
      .first({ sessionToken: req.user.sessionToken });
    console.log(accountInfo);
    accountInfo.set('posDetail', req.body);
    accountInfo.set('posSelected', true);
    await accountInfo.save(null, { sessionToken: req.user.sessionToken });

    var options = {
      from: '"FIND" <noreply@myfind.ca>',
      to: req.body.email,
      subject: 'Confirmation Schedule',
      html: '',
      attachments: [
        // {
        //   filename: 'square_icon.png',
        //   path: __dirname + '/../assets/images/square_icon.png',
        //   cid: 'square_icon',
        // },
        {
          filename: 'find_logo.png',
          path: __dirname + '/../assets/images/find_logo.png',
          cid: 'find_logo',
        },
      ],
    };

    fs.readFile(__dirname + '/../templates/email/Appoinment-email.html', (e, data) => {
      if (e) {
        console.log(e);
      }
      const $ = cheerio.load(data);
      $('#appoinment-date').text(`${req.body.day} at ${req.body.time}!`);
      $('#phone-number').text(`${req.body.phoneContact}.`);
      $('.action').append(`<a class='button link' href="mailto:support@myfind.ca">
            <input type='button' value='Reschedule' style='margin: 25px 0px; height: 40px; width: 140px; border-radius: 5px; background-color: #A2A2A2; color: white; 
            font-size: 16px; line-height: 28px;'> </input> 
          </a>`);
      options.html = $.html();
      __sendMail(options)
        .then(info => {
          options.to = 'support@myfind.ca';
          console.log('HIHI');
          __sendMail(options).then(success => {
            res.json({ success: true });
          });
        })
        .catch();
    });
  } catch (error) {
    console.log(error);
  }
};

export const put = async (req, res, next) => {
  try {
    const profile = new Merchant(req.body);
    if (profile.isValid()) {
      const merchant = await __query('Merchant')
        .equalTo('objectId', profile.get('objectId').id)
        .first({ sessionToken: req.user.sessionToken });
      merchant.set(profile.data);
      const newMerchant = await _checkMerchantFiles(merchant, req, next);
      merchant.save(null, { sessionToken: req.user.sessionToken }).then(response => {
        return res.json({
          message: 'Merchant successfully updated',
          resource: response,
        });
      });
    } else {
      return res.status(400).json({
        errors: profile.getErrors(),
      });
    }
  } catch (error) {
    return res.status(400).json({
      errors: JSON.stringify(error),
    });
  }
};

export const editPassword = (req, res, next) => {
  __query('User')
    .get(req.user.objectId, { sessionToken: req.user.sessionToken })
    .then(MerchantUser => {
      console.log('Changing Password', MerchantUser);
      MerchantUser.setPassword(req.body.password);

      return MerchantUser.save(null, { useMasterKey: true });
    })
    .then(success => {
      return res.json({ message: 'success' });
    })
    .catch(next);
};

export const verifyPassword = (req, res, next) => {
  __query('User')
    .get(req.user.objectId, { userMasterKey: true })
    .then(MerchantUser => {
      console.log('MERCHATN USER', MerchantUser);
      console.log(MerchantUser.get('password', { userMasterKey: true }));
      console.log(MerchantUser.password);
      if (MerchantUser.password === req.body.oldPassword) {
        return res.json({ message: 'success' });
      }

      return res.json({
        message: 'failed',
      });
    })
    .catch(next);
};

export const getNewsletter = (req, res, next) => {
  const q = __query('Newsletter')
    .equalTo('merchantId', req.user.merchantId)
    .notEqualTo('isDeleted', true);

  if (req.query.published) {
    q.equalTo('isPublished', req.query.published == 'true');
  }

  if (req.query.limit) {
    q.limit(req.query.limit);
  }

  if (req.query.offset) {
    q.skip(req.query.offset);
  }

  q.descending('createdAt');

  if (req.query.sort) {
    let sort = req.query.sort.split(',');
    if (sort.length == 2) {
      const column = sort[0];
      const direction = sort[1];

      if (direction === 'asc') {
        q.ascending(column);
      }

      if (direction === 'desc') {
        q.descending(column);
      }
    }
  }

  q
    .find({ sessionToken: req.user.sessionToken })
    .then(success => {
      return res.json(success);
    })
    .catch(next);
};

export const getCoupon = (req, res, next) => {
  const q = __query('Coupon')
    .equalTo('merchantId', req.user.merchantId)
    .notEqualTo('isDeleted', true);

  if (req.query.published) {
    q.equalTo('isPublished', req.query.published == 'true');
  }

  if (req.query.completed) {
    q.equalTo('isCompleted', req.query.completed == 'true');
  }

  if (req.query.limit) {
    q.limit(req.query.limit);
  }

  if (req.query.offset) {
    q.skip(req.query.offset);
  }

  q.descending('createdAt');

  if (req.query.sort) {
    let sort = req.query.sort.split(',');
    if (sort.length == 2) {
      const column = sort[0];
      const direction = sort[1];

      if (direction === 'asc') {
        q.ascending(column);
      }
    }
  }

  q
    .find({ sessionToken: req.user.sessionToken })
    .then(response => {
      return res.json(response);
    })
    .catch(next);
};

export const getRewards = (req, res, next) => {
  const q = __query('MerchantRewardInfo')
    .equalTo('merchantId', req.user.merchantId)
    .notEqualTo('isDeleted', true);

  if (req.query.published) {
    q.equalTo('isPublished', req.query.published === 'true');
  }

  if (req.query.limit) {
    q.limit(req.query.limit);
  }

  if (req.query.offset) {
    q.skip(req.query.offset);
  }

  q.ascending('pointsRequired');

  if (req.query.sort) {
    let sort = req.query.sort.split(',');
    if (sort.length === 2) {
      const column = sort[0];
      const direction = sort[1];

      if (direction === 'asc') {
        q.ascending(column);
      }

      if (direction === 'desc') {
        q.descending(column);
      }
    }
  }

  q
    .find({ sessionToken: req.user.sessionToken })
    .then(success => {
      return res.json(success);
    })
    .catch(next);
};

// fix me
export const getStorePos = (req, res, next) => {
  var stores = [];
  var posIds = [];

  __query('Store')
    .include('posId')
    .include('name')
    .equalTo('merchantId', req.user.merchantId)
    .find({ sessionToken: req.user.sessionToken })
    .then(success => {
      stores = success.map(entry => {
        return { key: entry.id, value: entry.id, text: entry.get('name') };
      });

      return __query('POS')
        .include('storeId')
        .matchesQuery('storeId', query)
        .find({ sessionToken: req.user.sessionToken });
    })
    .then(success => {
      posIds = success.map(entry => {
        return {
          key: entry.id,
          value: entry.id,
          text: entry.get('name'),
          store: entry.get('storeId').id,
        };
      });

      return res.json({
        pos: posIds,
        stores,
      });
    })
    .catch(next);
};

/**
 * @api {get} /api/merchant/transaction-count Request A a Merchant Transactions Count
 * @apiName getTransactionCount
 * @apiGroup Merchant
 *
 * @apiSuccess (200) {json} Success Response:
 *      HTTP/1.1 200 OK
 *     {
 *       "count": n
 *     }
 */
export const getTransactionCount = (req, res, next) => {
  __query('Transaction')
    .equalTo('merchantId', req.user.merchantId)
    .count({ useMasterKey: true, sessionToken: req.user.sessionToken })
    .then(count => {
      return res.json({ count });
    })
    .catch(next);
};

/**
 * @api {get} /api/merchant/transaction-count Request A a Merchant Transactions Count
 * @apiName getTransactionCount
 * @apiGroup Merchant
 *
 * @apiSuccess (200) {json} Success Response:
 *      HTTP/1.1 200 OK
 *     {
 *       "12/01/2017": n,
 *       "12/02/2017": n,
 *       "12/03/2017": n
 *     }
 */
export const getTransactionCountByDay = (req, res, next) => {
  if (req.query.limit && req.query.limit > 1) {
    req.query.limit = 1;
  }

  let params = {
    merchant: req.user.merchantId.objectId,
  };

  if (req.query.interval) {
    params.from = __subDaysFromDate(req.query.interval).format('YYYY-MM-DD');
    params.to = __getDate().format('YYYY-MM-DD');
  } else {
    params.from = __getDate(req.query.from).format('YYYY-MM-DD');
    params.to = __getDate(req.query.to).format('YYYY-MM-DD');
  }

  get('analytics/get_txns_count', params, {
    'x-api-key': 'reveal-glacier-mammoth',
  })
    .then(response => {
      console.log(response.body);
      res.json(response.body.message);
    })
    .catch(next);
};

export const getStores = (req, res, next) => {
  __query('Store')
    .include('posId')
    .include('name')
    .include('location')
    .equalTo('merchantId', req.user.merchantId)
    .notEqualTo('isDeleted', true)
    .find({ sessionToken: req.user.sessionToken })
    .then(success => {
      var stores = success.map(function(n) {
        return { key: n.id, value: n.id, text: n.get('name'), location: n.location };
      });
      return res.json(stores);
    })
    .catch(next);
};

export const getPos = (req, res, next) => {
  var posIds = [];

  const query = __query('Store')
    .include('posId')
    .include('name')
    .equalTo('merchantId', req.user.merchantId);

  __query('POS')
    .include('storeId')
    .matchesQuery('storeId', query)
    .find({ sessionToken: req.user.sessionToken })
    .then(pos => {
      posIds = pos.map(entry => {
        return {
          key: entry.id,
          value: entry.id,
          text: entry.get('name'),
          store: entry.get('storeId').id,
        };
      });

      return res.json(posIds);
    })
    .catch(next);
};

export const setGoal = (req, res, next) => {
  const { name, goal } = req.body;

  if (!name) {
    throw new Error(`A goal name is required when persisting a merchant goal, name provided '${name}'`);
  }

  if (!goal && goal !== 0) {
    throw new Error(`A goal value is required when persisting a merchant goal, value provided '${goal.toString()}'`);
  }

  var Merchant = new Parse.Object('Merchant');
  var q_merch = new Parse.Query(Merchant);

  q_merch.equalTo('objectId', req.user.merchantId.objectId);
  q_merch.include('goal');

  q_merch
    .first({ sessionToken: req.user.sessionToken })
    .then(merchant => {
      var newGoal = merchant.get('goal');
      if (!newGoal) {
        newGoal = {};
      }

      newGoal[name] = goal;

      merchant.set('goal', newGoal);
      return merchant.save(null, { sessionToken: req.user.sessionToken });
    })
    .then(merchant => {
      return res.json(merchant.get('goal'));
    })
    .catch(next);
};

export const getTotalOffersRedeemed = (req, res, next) => {
  __query('UserCoupon')
    .include('couponId')
    .equalTo('isRedeemed', true)
    .matchesQuery('couponId', __query('Coupon').equalTo('merchantId', req.user.merchantId))
    .count({ useMasterKey: true, sessionToken: req.user.sessionToken })
    .then(redeems => {
      res.json({ count: redeems });
    })
    .catch(next);
};

export const getTotalOffersRedeemedByDay = (req, res, next) => {
  var time = __subDaysFromDate(req.body.limit || 7);

  __query('UserCoupon')
    .include('couponId')

    .equalTo('isRedeemed', true)
    .greaterThan('redeemedAt', time.unix())
    .matchesQuery('couponId', __query('Coupon').equalTo('merchantId', req.user.merchantId))
    .find({ useMasterKey: true, sessionToken: req.user.sessionToken })
    .then(response => {
      response = __groupBy(response, userCoupon => {
        userCoupon = userCoupon.toJSON();
        console.log(__getDate(userCoupon.redeemedAt));
        return __getDate(userCoupon.redeemedAt).format('MM-DD-YYYY');
      });

      let final_response = {};
      response = Object.keys(response).map(day => {
        final_response[day] = response[day].length;
      });

      return res.json(final_response);
    })
    .catch(next);
};

export const getTopCashier = (req, res, next) => {
  const time = __subDaysFromDate(req.query.limit || 90);
  const order = req.query.order && ['asc', 'desc'].indexOf(req.query.order) > -1 ? req.query.order : 'desc';

  __query('Transaction')
    .include('storeId')
    .equalTo('merchantId', req.user.merchantId)
    .greaterThan('transTime', time.unix())
    .exists('cashier')
    .ascending('transTime')
    .find({ useMasterKey: true, sessionToken: req.user.sessionToken })
    .then(response => {
      response = __groupBy(response, transaction => {
        transaction = transaction.toJSON();
        return transaction.cashier;
      });

      let cashiers = {};

      Object.keys(response).map(cashier => {
        let total = 0;
        let itemsTotal = 0;
        let store = null;
        let pos = null;

        response[cashier].forEach(transaction => {
          transaction = transaction.toJSON();
          total += transaction.totalPrice;
          if (transaction.transactionDetail) {
            itemsTotal += transaction.transactionDetail.length;
          }

          if (!store) {
            store = transaction.storeId;
          }

          if (!pos) {
            pos = transaction.posId.objectId;
          }
        });

        cashiers[cashier] = {
          name: cashier,
          total,
          itemsTotal,
          store: {
            name: store.name,
            location: {
              latitude: store.location.latitude,
              longitude: store.location.longitude,
            },
            address: store.address,
          },
          pos,
        };
      });

      cashiers = Object.keys(cashiers).map(item => cashiers[item]);

      return res.json(__sortByNumberOnKey(cashiers, 'total', order));
    })
    .catch(next);
};

const DataFormater = params => {
  let newParams = {};
  for (let object in params) {
    console.log(object);
    if (Object.hasOwnProperty('vendorHeader')) {
      Object.assign({ vendorHeader: __file(params[object]), newParams });
    } else if (Object.hasOwnProperty('vendorLogo')) {
      Object.assign({ vendorLogo: __file(params[object]) }, newParams);
    } else {
      Object.assign(object, newParams);
    }
  }
  return newParams;
};
