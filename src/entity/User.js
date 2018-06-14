import Entity from './Entity';

export default class User extends Entity {
  constructor(data) {
    super();

    this.definition = {
      objectId: {
        type: 'object',
        required: false,
      },
      firstName: {
        type: 'string',
        required: false,
      },
      lastName: {
        type: 'string',
        required: false,
      },
      merchantId: {
        type: 'object',
        required: true,
      },
      demoMerchantId: {
        type: 'object',
        required: true,
      },
      accountType: {
        type: 'string',
        required: true,
        default: 'PORTAL',
      },
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
      email: {
        type: 'string',
        required: true,
      },
      emailVerified: {
        type: 'boolean',
        required: false,
        default: 'false',
      },
      IsTermsAccepted: {
        type: 'boolean',
        required: false,
        default: 'false',
      },
      createdAt: {
        type: 'datetime',
        required: false,
      },
      updatedAt: {
        type: 'datetime',
        required: false,
      },
      posId: {
        type: 'object',
        required: false,
      },
      storeId: {
        type: 'object',
        required: false,
      },
    };

    if (data.objectId && typeof data.objectId === 'string') {
      data.objectId = {
        id: data.objectId,
      };
    }

    this._load(data);
  }
}
