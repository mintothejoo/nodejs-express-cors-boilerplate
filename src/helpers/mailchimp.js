import request from 'superagent';
import cheerio from 'cheerio';

export const __get = (module, params, req) => {
  if (!params) {
    params = {};
  }

  return new Promise((resolve, reject) => {
    const merchant = req.user.merchant;
    const mailchimpUrl = merchant.get('mailchimpUrl');
    const mailchimpToken = merchant.get('mailchimpToken');

    request
      .get([mailchimpUrl, '3.0', module].join('/'), params)
      .set('Authorization', 'OAuth ' + mailchimpToken)
      .accept('json')
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  });
};

export const __cleanTemplate = html => {
  const $ = cheerio.load(html);

  $('table#canspamBarWrapper').remove();
  $('table#templatePreheader').remove();

  return $.html();
};
