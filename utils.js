var fs = require('fs')
var debug = require('debug')('crawler')

exports.mkdir = function(folder,cb){
    var mkdirp = require('mkdirp');
    mkdirp(__dirname+'/dist/' + folder, function (err) {
        if (err) console.error(err)
        else debug('pow!');
        cb();
    });
}

exports.write_chapter = function(chapter, content,callback){
     content = content.replace('[± »§ø‚ ÷ª˙∞Ê m.biquku.com]', '')

    fs.writeFile(__dirname+'/dist/0/330/' + chapter.num + '.html', content, function (err) {
        if (err) throw err;
        debug('It\'s saved!');
        callback(null,content);
    });
}

exports.write_config = function(book){
    var content =  JSON.stringify(book, null, 4); // Indented 4 spaces
    fs.writeFile(__dirname+'/dist/0/330/book.json', content, function (err) {
        if (err) throw err;
        debug('It\'s saved!');
    });
}