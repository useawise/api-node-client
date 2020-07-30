const uuidv1 = require('uuid/v1');
const fs = require('fs');
const JsonApi = require('devour-client');
const qs = require('qs');
const glob = require('glob');
const path = require('path');
const axios = require('axios');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
    ]
});

function sessionCacheWriteFile(session) {
    if (!config.cacheFilename) {
        throw new Error ("No filaname set");
    }
    const cacheFile = config.cacheFilename;

    fs.writeFileSync(cacheFile, JSON.stringify(session), function(err) {
        if(err) {
            throw new Error (err);
        }
    }); 
}

function sessionCacheReadFile(callback) {
    if (!config.cacheFilename) {
        throw new Error ("No filaname set");
    }
    const cacheFile = config.cacheFilename;

    fs.readFile(cacheFile, (err, data) => {
        let session = null;
        if (data) {
            session = JSON.parse(data);
        }
        callback(session);
    });
}

function getSession(domain,login,password,callback) {
    return new Promise((resolve,reject) => { 
        config.sessionCacheRead((session) => {
            let mustCreateNewSession = true;
            if (session && session.expirationDateTime && (Date.now() < new Date(session.expirationDateTime))) {
                mustCreateNewSession = false;
            }

            if (mustCreateNewSession) {
                logger.debug("Creating new session");
                let namespace = "",
                    url = `${domain}/${namespace}sessions`;
                axios({
                    method: 'POST',
                    url,
                    data: {
                        data: {
                            type: 'session-request',
                            attributes: { login, password, userAgent: 'qsna-auth-lib' }
                        }
                    }
                }).then((response) => {
                    let data = response.data.data;
                    logger.debug(JSON.stringify(data));
                    if (!data) {
                        throw new Error ("Failed to get user session");
                    }
                    let newSession = {
                        id: data.id,
                        secret: data.attributes.key,
                        expirationDateTime: data.attributes.expirationDateTime
                    }

                    config.sessionCacheWrite(newSession);

                    resolve(newSession);
                }).catch((err) => {
                    if (err) { logger.debug(err); }
                    reject(err);
                });
            }
            else {
                logger.debug("Reusing session");
                resolve(session);
            }
        });
    });
}


function initJsonApiDefines(jsonApi) {
    // Load all the resources
    glob.sync(path.join(__dirname, '/resources/**/*.js'), { absolute: true })
        .forEach((filename) => require(filename).register(jsonApi));
}

function initJsonApiMiddleware(jsonApi,session) {
    let hmacMiddleware = {
        name: 'HMAC Middleware',
        req: (payload)=> {
            let signedHeaders = {
                'x-company': config.company,
                'x-branch': config.branch
            };

            const urlMatchDomain = payload.req.url.match(/^http[s]?:\/\/([^/]+)/);
            const urlMatchPath = payload.req.url.match(/^http[s]?:\/\/(?:[^/]+)(\/[^?]+)/);
            logger.debug("data");
            logger.debug(payload.req.data);
            logger.debug("url");
            logger.debug(payload.req.url);
            logger.debug("params");
            logger.debug(JSON.stringify(payload.req.params));
            logger.debug("urlMatchDomain");
            logger.debug(urlMatchDomain);
            logger.debug("urlMatchPath");
            logger.debug(urlMatchPath);
            if (!urlMatchDomain) {
                throw new Error("Invalid API URL");
            }
            const domain = urlMatchDomain[1];
            let path = "/";
            if (urlMatchPath) {
                path = urlMatchPath[1];
                if (path == "/companies") {
                    signedHeaders=null;
                }
            }
            let queryString = decodeURI(qs.stringify(payload.req.params));
            logger.debug("queryString");
            logger.debug(queryString);
            logger.debug("payload.req");
            logger.debug(JSON.stringify(payload.req));

            payload.req.headers['Authorization']=`SessionId ${session.id}`;
            if (signedHeaders) {
                payload.req.headers['x-company']=config.company;
                payload.req.headers['x-branch']=config.branch;
            }
            return payload;
        }
    }
    jsonApi.insertMiddlewareBefore('axios-request', hmacMiddleware);
}

function initDevour(apiUrl,session) {
    const jsonApi = new JsonApi({apiUrl});
    initJsonApiDefines(jsonApi);
    initJsonApiMiddleware(jsonApi,session);
    return jsonApi;
}

const config = {
    'company': 1,
    'branch': 1,
    'sessionCacheRead':sessionCacheReadFile,
    'sessionCacheWrite':sessionCacheWriteFile,
    'domain':'https://api.beta.quantosobra.com.br',
    'login':'',
    'password':'',
    'cacheFilename': "./session.cache"
}

function setConfig(conf) {
    const validKeys = ['company', 'branch', 'sessionCacheRead', 'sessionCacheWrite', 'cacheFilename', 'login', 'password', 'domain'];
    if (!conf) return;
    for (const key in conf) {
        if (validKeys.includes(key)) {
            config[key]=conf[key];
        }
        else {
            throw "Unknown configuration key: "+key;
        }
    }
}

/**
 * @return Devour jsonApi object. See https://github.com/twg/devour
 */
async function init(conf) {
    setConfig(conf);
    session = await getSession(config.domain,config.login,config.password);
    jsonApi = initDevour(config.domain,session);
    return(jsonApi);
}

module.exports = init;
