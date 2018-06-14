import { __checkUserExists, __confirmEmail } from './../../domain/user';

export const confirmEmail = (req, res, next) => {
  const userId = Buffer.from(req.body.userId, 'base64').toString();

  __confirmEmail(userId)
    .then(response => {
      console.log(response);
      return res.json({ message: 'Email confirmed!' });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

export const userExists = (req, res, next) => {
  __checkUserExists(req.query, (error, exists) => {
    if (error) {
      return next(error);
    }

    res.json({ exists });
  });
};

