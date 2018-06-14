import Entity from './Entity';

export default class Merchant extends Entity {
  constructor(data) {
    super();

    this.definition = {
      objectId: {
        type: 'object',
        required: 'false',
      },
      hasRecognitionProgram: {
        type: 'boolean',
        required: false,
        default: 'false',
      },
      tapActionMessage: {
        type: 'string',
        required: false,
        default: 'Thank you for shoppping with us!',
      },
      pointExchangeRate: {
        type: 'number',
        required: false,
        default: '0',
      },
      primePoints: {
        type: 'number',
        required: false,
        default: '0',
      },
      roleName: {
        type: 'string',
        required: false,
        default: 'null',
      },
      vendorName: {
        type: 'string',
        required: false,
        default: 'null',
      },
      vendorLogo: {
        type: 'object',
        required: false,
        default: null,
      },
      isDemo: {
        type: 'boolean',
        required: false,
        default: 'false',
      },
      goal: {
        type: 'object',
        required: false,
        default: {},
      },
      category: {
        type: 'string',
        required: false,
        default: 'null',
      },
      merchantPOS: {
        type: 'object',
        required: false,
        default: null,
      },
      merchantStores: {
        type: 'object',
        required: false,
        default: null,
      },
      vendorHeader: {
        type: 'object',
        required: false,
        default: null,
      },
      mailchimpToken: {
        type: 'string',
        required: false,
        default: 'null',
      },
      WebpageLink: {
        type: 'string',
        required: false,
        default: 'null',
      },
      country: {
        type: 'string',
        required: false,
      },
      merchantUsers: {
        type: 'object',
        required: false,
        default: null,
      },
      active: {
        type: 'boolean',
        required: false,
        default: 'false',
      },
      aboutMerchant: {
        type: 'string',
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
