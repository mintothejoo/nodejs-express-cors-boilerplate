import { __signUp, __checkMerchantExists } from './../../domain/merchant';

export const signUp = (req, res, next) => {
  __signUp(req.body)
    .then((merchant, mail) => {
      return res.json({ message: 'Please confirm email' });
    })
    .catch(next);
};


export const merchantExists = (req, res, next) => {
  __checkMerchantExists(req.params, (error, exists) => {
    if (error) {
      return next(error);
    }

    res.json({ exists });
  });
};
