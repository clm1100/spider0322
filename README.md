# spider0322
根据桑大抓取小说的爬虫，自己改造的一个爬虫，还有些不足，不明白晚上async的并发控制为什么会无缘无故的停止

主程序是在index2.js中，封装了一个工具函数utli.js主要是操作文件的。

主要用到了 async cheerio superagent superagent-charset

工具封装了3个函数，主要是操作文件，第一个函数为：

```
exports.mkdir = function(folder,cb){
    var mkdirp = require('mkdirp');
    mkdirp(__dirname+'/dist/' + folder, function (err) {
        if (err) console.error(err)
        else debug('pow!');
        cb();
    });
}
```

第二个函数为：
```
exports.write_chapter = function(chapter, content,callback){
     content = content.replace('[笔趣库手机版 m.biquku.com]', '')

    fs.writeFile(__dirname+'/dist/0/330/' + chapter.num + '.html', content, function (err) {
        if (err) throw err;
        debug('It\'s saved!');
        callback(null,content);
    });
}
```


第三个参数为：

```
exports.write_config = function(book){
    var content =  JSON.stringify(book, null, 4); // Indented 4 spaces
    fs.writeFile(__dirname+'/dist/0/330/book.json', content, function (err) {
        if (err) throw err;
        debug('It\'s saved!');
    });
}
```

## 控制并发时做了一个超时处理：
```
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
```

### ？但这里有疑问 定时函数里面如果运行callback会报错,我这里是什么也不做;

### 最后异步顺序我用的是原生Promise来控制，这里对promise有了比较深刻的理解但是总是捕捉不到错误；