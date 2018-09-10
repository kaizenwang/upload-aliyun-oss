import ossUpload, { Config, Policy } from '../oss_upload';

interface Response {
    code: number;
    msg: string;
    data: Policy;
    token: string;
}

let config: Config = {
    policyUrl: 'http://127.0.0.1:8780/policy',
    project: 'test1',
    decode: function(json: string): Policy{
        let obj: Response = JSON.parse(json);        
        return obj.data;
    }
}

ossUpload(config, '/data/Pictures/9591497685315_.pic.jpg', (err, msg) => {
    if (msg && (msg.code == 200)) {
        console.log('imageURL', msg.host + msg.dir);
    }
});
