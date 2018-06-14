import cors from 'cors'
import config from './../config/config'


const whitelist = config.cors.whitelist[process.env.NODE_ENV];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Host ("'+ process.env.NODE_ENV + ':' + origin +'") is not allowed by CORS!'))
        }
    },
    maxAge: 300,
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, On-behalf-of, x-apicache-bypass",
    exposedHeaders: "Origin, X-Requested-With, Content-Type, Accept, On-behalf-of, x-apicache-bypass"
};

export default cors(corsOptions);