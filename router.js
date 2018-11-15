function route(handle,pathname,response,request){
    console.log("About to route a request for " + pathname);
    if( typeof(handle[pathname]) === 'function'){
        //return handle[pathname]();
        handle[pathname](response,request)
    /* 在index中，handle[*]代表了requesthandlers里的一个函数，也就是对应的请求处理程序
     * 用从关联数组中获取元素一样的方式  从传递的对象中获取请求处理函数
     * 后传递到server再传递到router中
     * 由此，服务器server路由router请求处理程序requesthandlers连接在一起了
     */
    }else{
        console.log("No request handler found for " + pathname);
        //return '404 from router'
        response.writeHead( 404,{'Content-Type':'text/plain'});
        response.write('404 from router');
        response.end();
    }
}
/**
 * 是将requestHandlers模块硬编码到路由里来使用，还是再添加一点依赖注入？
 * 虽然和其他模式一样，依赖注入不应该仅仅为使用而使用，但在现在这个情况下，
 * 使用依赖注入可以让路由和请求处理程序之间的耦合更加松散，也因此能让路由的重用性更高。
 */

exports.route = route;