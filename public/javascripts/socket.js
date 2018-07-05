var orderModel = require('../../model/order');
var userModel = require('../../model/user');
exports.getScoket = function (server) {
  const _io = require('socket.io')(server)
  _io.set('transports', ['websocket', 'polling', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  _io.set('origins', '*:*');

  // //只发给当前客户端
  // socket.emit("msg", "socket:" + socket.id);
  // //发送给所有连接的客户端
  // _io.emit("msg", "io:" + socket.id);
  orderModel.init(_io);
  userModel.init(_io);
};
