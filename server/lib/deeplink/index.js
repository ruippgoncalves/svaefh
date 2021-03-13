// Fork of https://github.com/mderazon/node-deeplink (MIT License)
const fs = require('fs');
const stream = require('stream');
const path = require('path');

module.exports = () => {
    const deeplink = (req, res) => {
        const options = {
            url: `svaefh://redirect?code=${req.query.code}`,
            fallback: `${req.protocol}://${req.get('host')}`,
            android_package_name: process.env.ANDROID_PACKAGE_NAME,
            ios_store_link: process.env.IOS_STORE_LINK
        };

        // read template file
        const file = fs.createReadStream(
            path.join(__dirname, '/public/index.html')
        );

        // replace all template tokens with values from options
        const detoken = new stream.Transform({ objectMode: true });
        detoken._transform = (chunk, encoding, done) => {
            let data = chunk.toString();

            Object.keys(options).forEach((key) => {
                data = data.replace(`{{${key}}}`, options[key]);
            });

            done(null, data);
        };

        // make sure the page is being sent as html
        res.set('Content-Type', 'text/html; charset=utf-8');

        // read file --> detokenize --> send out
        file.pipe(detoken).pipe(res);
    };

    return deeplink;
};
