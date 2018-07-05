var orderModel = {};
orderModel.init = function(_io) {
  _io.on('connection', function (socket) {
    _io.emit('order', { msg: 'Welcome bro!' });
    socket.on('order',function(msg){
    	_io.emit('order', { msg: "you sent : "+msg });
    })
  })
};

module.exports = orderModel;