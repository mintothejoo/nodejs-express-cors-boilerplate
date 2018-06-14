import nodemailer from 'nodemailer';
import Config from './../config/config';

export const __sendMail = options => {
  return new Promise((resolve, reject) => {
    try {
      nodemailer.createTestAccount((err, account) => {
        if (err) console.log('Error');
        let transporter = nodemailer.createTransport(Config.mailer);
        // let transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     secure: false, // true fo
        //     auth: {
        //         user: account.user,
        //         pass: account.pass
        //     }
        // });
        transporter.sendMail(options, (error, info) => {
          if (error) {
            reject(error);
          }
          console.log('Sent email');
          resolve(info);
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};
