var mkdirp = require("mkdirp");
mkdirp(__dirname+'/a/b/c/d', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});

ssh-keygen -t rsa -C "27529811@qq.com"