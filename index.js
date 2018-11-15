var server = require('./server')
var router = require('./router')
var requestHandlers = require('./requestHandlers')

var handle = {}
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;
/* handle是一些请求处理程序的集合
 * 将不同的url映射到相应的请求处理程序上，再之后传递给服务器
 */
server.start(router.route,handle)
/**
 * 步骤：
 * （请求处理程序 -> 请求路由 -> 服务器）
 * 将请求处理程序返回的内容（请求处理程序最终要显示给用户的内容）
 * 传递给HTTP服务器
 */
