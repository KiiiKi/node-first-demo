var exec = require('child_process').exec; 
//使用child_process模块可以创建和控制子进程

var querystring = require('querystring')
// querystring模块来解析POST请求体中的参数

var fs = require('fs')
//fs内置模块提供对文件的操作。包括文件属性读写、文件内容读写、底层文件操作

var formidable = require('formidable')
/* 处理上传的文件数据
 * 这里该模块做的就是将通过HTTP POST请求提交的表单，在Node.js中可以被解析。
 * 要做的就是创建一个新的IncomingForm，它是对提交表单的抽象表示，
 * 之后，就可以用它解析request对象，获取表单中需要的数据字段
 */

//requestHandlers的模块，并对于每一个请求处理程序，添加一个占位用函数

function start(response){
    console.log('request handler "start" 开始')
    var testt = 10;
    /*
    当在请求处理程序中加入阻塞操作时会发生什么。
    function sleep(s){
        var starttime = new Date().getTime();
        while( new Date().getTime() < starttime + s);
    }
    sleep(10000);//为什么不能用settimeout？
    */

    //var content = 'empty';

    //form action属性规定提交表单信息时，向何处发送表单数据，若action为空则代表当前页面刷新
    //form enctype 属性规定在将表单数据发送到服务器之前如何对其进行编码
    var body = '<html>'+
                '<head>'+
                '<meta http-equiv="Content-Type" content="text/html; '+
                'charset=UTF-8" />'+
                '</head>'+
                '<body>'+
                '<form action="/upload" enctype="multipart/form-data"  method="post">'+ 
                '<input type="file" name="upload">'+
                '<input type="submit" value="upload file"/>'+
                '</form>'+
                '</body>'+
                '</html>';

//    exec('ls-lah',function( error, stdout, stderr){
        /*exec让node来执行一个shell命令，ls-lah是显示当前目录下的文件
         * 没有显示当前目录只显示了‘empty’是因为exec()是异步执行，
         * 而node为同步执行，在调用完exec后马上return content了，
         * 而传递给exec的回调函数还未执行到
         */
        //content = stdout;
        response.writeHead( 200,{'Content-Type':'text/html'});
        //response.writeHead( 200,{'Content-Type':'text/plain'});
        //response.write(stdout );
        response.write(body)
        response.end();
//    })
    //return content;
    //return 'start from handler'
  
}

function upload(response,request){
    console.log('request handler "upload" 开始')
    //return 'upload from handler'
    var form = new formidable.IncomingForm();
    console.log('开始formidable parse')
    form.parse(request, function(err, fields, files) {
        console.log('parse结束')
        console.log(files)
        fs.renameSync(files.upload.path,'./timg.jpg')
        response.writeHead(200, {'content-type': 'text/html'});
        response.write('received image:<br/>');
        //图片信息存储在了/show链接里，此处直接显示出来
        response.write('<img src = "/show"/>')
        response.end();
    });
    //response.writeHead( 200,{'Content-Type':'text/plain'});
    //response.write('you have sent:'+querystring.parse(postdata).text);
    //response.end();
}

function show(response){
    console.log('request handler "show" 开始')
    //fs.readFile(pathname, function (err, data){})
    fs.readFile('./timg.jpg','binary',function(error,file){
        /* 其中'./timg.jpg'为文件地址，此文件必须在当前目录下
         * 'binary'为文件的编码方式二进制，还有utf8
         * *****标准回调方式（err，file）*****
         * 异步读取时，正常读取时err为空，data为string。错误时err为错误对象，data为undefined
         */
        if(error){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + '\n');
            response.end()
        }else{
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    })
}

exports.start = start;
exports.upload = upload;
exports.show = show;