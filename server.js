var http = require('http')
/*请求（require）Node.js自带的 http 模块，
 *并且把它赋值给 http 变量。
 */
var url = require('url')
/* 处理HTTP请求时url模块使用率超高，因为该模块允许解析URL、生成URL，以及拼接URL。
 * url.parse(string).***可以切分url的各板块
 * protocol,auth,host,port,hostname,hash,search,query,pathname,path,href
 */

/* createServer 。这个函数会返回一个对象，
 * 这个对象有一个叫做 listen 的方法，
 * 这个方法有一个数值参数，指定这个HTTP服务器监听的端口号。
 */
function start(route,handle){
    //route函数当作参数引入，便于针对不同的urlpath做不同操作
    //handle函数作为参数引入，再传给router，也就是index经过服务器server传递给了路由router
    http.createServer( function( request, response){
        //只要有连接到某链接，就会创建一个http.createServer，从而对应发生handle
        //给createserver传递一个匿名函数
        //request和response是两个对象，用对象的方法来处理请求的细节，并且响应请求
        if(request.url !== '/favicon.ico'){//为了去掉/favicon.ico的请求
            console.log('request开始')
            //没有打开locahost就不会运行的request

            var pathname = url.parse(request.url).pathname;
            //request中存储着这个请求的详情
            console.log("收到 " + pathname + " 的request请求");
            /**
             * 因为POST请求一般都比较“重” —— 用户可能会输入大量的内容。
             * 用阻塞的方式处理大数据量的请求必然会导致用户操作的阻塞。
             * 为了使整个过程非阻塞，Node.js会将POST数据拆分成很多小的数据块，
             * 然后通过触发特定的事件，将这些小数据块传递给回调函数。
             */
            /**
             * 获取所有来自请求的数据，然后将这些数据给应用层server处理
             * 我们直接在服务器中处理POST数据，
             * 然后将最终的数据传递给请求路由和请求处理器，让他们来进行进一步的处理。
             */
            //var postdata = '';
            /*
            request.setEncoding('utf8');//接收数据的编码格式
            //这里的特定的事件有data事件（表示新的小数据块到达了）
            //通过在request对象上注册listener来进行回调函数
            //这些属于数据流吗？
            request.addListener( 'data',function( postdatachunk){
                postdata += postdatachunk;
                console.log('收到post的data数据块：'+ postdatachunk)
            })
            //里的特定的事件有end事件（表示所有的数据都已经接收完毕）。
            request.addListener( 'end',function(){
                route(handle,pathname,response,postdata);
            })
            */
           route(handle,pathname,response,request);

            //route(handle,pathname,response);
            //为了以后对于不同的路由进行不同的操作

            /* response.writeHead( 200,{ 'Content-Type': 'text/plain'});
             * 在network里的general和response header显示
             * response.write(content);
             * 将response给router，router再给handler来处理response内容，
             * 不在server里处理response了
             */
        }
        //response.end();
    }).listen(8888)

    console.log('server has started')
    //创建了服务器后，即使没有http请求进来，代码依旧是有效的证明
}
/**
 * 在Node.js程序中，当一个新的请求到达8888端口的时候，
 * 我们怎么控制流程呢？
 * 我们创建了服务器，并且向创建它的方法传递了一个函数。
 * 无论何时我们的服务器收到一个请求，这个函数就会被调用。（回调）
 */
exports.start = start;
 /* 把服务器脚本放到一个叫做 start 的函数里，然后导出这个函数。
  * 于是server.js现在是一个‘模块’，然后在入口文件中require，
  * 就可以在入口文件中像使用http这种内置模块一样使用自定义模块了
  */