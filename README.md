## 《node入门》书中的上传和图片图片的demo  
***
**流程:**  
**start() ---> createServer() ---> route() ---> handle() ---> requestHandler() ---> response**
***
### 因为没有使用node的框架，几个文件（index.js/requestHandlers.js/router.js/server.js)  和express框架中的对比为：  
*跟着书改动，所以里面很多注释掉了*
#### 1. index.js和express的入口文件app.js
* index.js文件：
    
    ```
    var handle = {}
    handle['/'] = requestHandlers.start;
    ....
    ....
    server.start(router.route,handle)
    ```
    >  ① handle是对**路由route**进行设置，不同的路由进入requestHandlers中不同的处理。  
    >  ② server.start()在启动程序“node index.js”时就调用了下面的server（建立http服务）
    
* app.js文件：
    
    ```
    var indexRouter = require('./routes/index');
    .....
    app.use('/', indexRouter);
    ```
    > 对应到express框架中，设置路由就是app.use(...)
    
  
    
    
#### 2. server.js件和express的bin/www.js  

* server.js文件：  
    
    ```
    function start(route, handle){
        http.createServer(function(request, response){
            ....
            ....
            var pathname = url.parse(request.url).pathname;
            route(handle, pathname, response, request)
        }
    }.listen(8888)
    exports.start = start;
    ```
    > 建立http服务，监听8888口，把所有路由的入口都设在这里，再对应不同的path，转去router.js中来调用对应的requestHandler  
    
* bin/www.js文件：
    
    ```
    var app = require('../app');
    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);
    var server = http.createServer(app);
    server.listen(port);
    ```
    > 监听3000口，剩下的都给app.js处理  
#### 3.router.js + requestHandlers.js 和 express的routes/index.js + views模版  
* router.js + requestHandlers.js
    
    ```
    //router.js
    if( typeof(handle[pathname]) === 'function'){
        handle[pathname](response, request)
    }else{
        console.log("No request handler found for " + pathname);
        //return '404 from router'
        response.writeHead( 404,{'Content-Type':'text/plain'});
        response.write('404 from router');
        response.end();
    }
    ```
    > 其中else里的返回内容在express的app.js里已经写明。
    
    ```
    //requestHandlers.js
    function upload(response,request){
        var body = '<html>'+
                '<head>'+
                '<meta http-equiv="Content-Type" content="text/html; '+
                'charset=UTF-8" />'+
                '</head>'+
                '<body>'+
                '....' +
                '</body>'+
                '</html>';
        ....
        response.writeHead(200, {'content-type': 'text/html'});
        response.write(body);
        response.end();
    });
    ```
    > 对不同路由的申请进行对应的操作,对返回的内容直接写在requestHandler中  
    
* express的routes/index.js + views模版  
    
    ```
    //routes/index.js
    router.get('/', function(req, res, next) {
        res.render('./index', { 
            title: 'express',
        })
    });
    ```
    > 对应localhost:3000/的访问，使用views/index.jade模版，并传递title:"express"给模版，再做为response输出。
    
    ```
    //views里放模版
    doctype html
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
      body
        h2= title
    ```
    > 举例jade模版，route将title传递过来，套入模版后，再给response返回。




