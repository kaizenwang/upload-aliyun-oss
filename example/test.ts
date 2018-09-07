import ossUpload, { Config } from '../oss_upload';

let config: Config = {
    baseURL: 'http://127.0.0.1:8780',
    apiPolicy: '/policy',
    project: 'test1'
}

ossUpload(config, '/data/Pictures/9591497685315_.pic.jpg', (err, msg) => {
    if (msg && (msg.code == 200)) {
        console.log('imageURL', msg.host + msg.dir);
    }
});
