var cheerio = require('cheerio');
var utils = require('./utils');
var charset = require('superagent-charset');
var superagent = charset(require('superagent'));
var async = require('async');
var current_book = { };

var url = "http://www.biquku.com/0/330/";


function Start() {
    return new Promise(function(resolve,reject){
        superagent.get(url).charset('gb2312').end(function(err, res){
            if(!err){
                //console.log(res.text);
                $ = cheerio.load(res.text,{decodeEntities:false});
                var urls = $('#list a');
                current_book.title = $('#maininfo h1').text();
                current_book.author = $('#info p').eq(0).text();
                current_book.update_time = $('#info p').eq(2).text();
                current_book.latest_chapter = $('#info p').eq(3).text();
                current_book.intro = $('#intro p').html()
                current_book.chapters = [];
                for(var i = 0; i< urls.length; i++){
                    var url = urls[i];
                    var _url = $(url).attr('href')+"";
                    var num = _url.replace('.html','');
                    var title = $(url).text();
                    current_book.chapters.push({
                        num: num,
                        title: title,
                        url: _url
                    })
                }
                console.log(current_book.chapters);
                utils.mkdir('0/330',function(){
                    resolve(current_book.chapters);
                });
            }
        });
    })
}

Start().then(dealUrl).then(function(){
    console.log("ok")
}).catch(function(err){
    console.log(err);
});
/*
*
 */
var n=0;
var fetchUrl = function  (href, callback) {
    var url = 'http://www.biquku.com/0/330/' + href.num + '.html';
    var that = this;

    superagent.get(url).charset('gb2312').end(function(err,res){
        if(!err){
            clearTimeout(timer);
            var $ = cheerio.load(res.text,{decodeEntities:false});
            var content = $('#content').html();
            console.log("content",++n);
            utils.write_chapter(href, content,callback);
        }
        //callback(null,content)
    });

    var timer = setTimeout(function(){
        console.log("123456789");
        //utils.write_chapter(href, "没有抓到出错了",callback);
    },2000);

}
function dealUrl(urls){
    return new Promise(function(resolve, reject){
        async.mapLimit(urls, 10, function (url, callback) {
            fetchUrl(url, callback);
        }, function (err, result) {
            console.log(err);
            if(!err){
                resolve()
            }
        });

    })

}

