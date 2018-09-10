import request = require('request');
import fs = require('fs');
import md5 = require('md5');

interface Policy {
    accessid: string;
    policy: string;
    signature: string;
    dir: string;
    host: string;
    expire: string;
}

interface Message {
    code: number;
    host: string;
    dir: string;
}

interface Config {
    policyUrl: string;
    project: string;
    decode: (json: string)=>Policy;
}

type UploadCallback = (error: any, msg?: Message) => void;
 

function upload(config: Config, filepath: string, callback: UploadCallback) {
    request
        .get(config.policyUrl + '/' + config.project)
        .on('response', function(resp: request.Response) {
            let rawData = '';
            resp.on("data", (chunk: any) => {
                rawData += chunk;
            });
            resp.on('end', () => {
                postObject(config.decode(rawData), filepath, callback);
            });
        })
        .on('error', (err)=>{
            callback(err);
        })
}

function postObject(p: Policy, filepath: string, callback: UploadCallback) {
    let filename = filepath.substring(filepath.lastIndexOf('/')+1, filepath.length)
    request(newRequest(p, filepath, filename), (error: any, response: request.Response, body: any)=>{
        let msg: Message = {
            code: response && response.statusCode,
            host: p.host,
            dir: '/' + p.dir + filename
        };
        callback(msg);
    })
}

function newRequest(p: Policy, filepath: string, filename: string): any{
    let hash = md5(p.accessid + p.policy + p.signature + filename);
    let boundary = '----WebKit' + hash;
    return {
        method: 'POST',
        url: p.host,
        headers:
        {
            'content-type': 'multipart/form-data; boundary=' + boundary
        },
        formData:
        {
            OSSAccessKeyId: p.accessid,
            policy: p.policy,
            Signature: p.signature,
            success_action_status: '200',
            'x-oss-object-acl': 'public-read',
            key: p.dir + filename,
            file:
            {
                value: fs.createReadStream(filepath),
                options:
                {
                    filename: filepath,
                    contentType: null
                }
            }
        }
    };
}

export {Policy, Message, Config, upload};
export default upload;

