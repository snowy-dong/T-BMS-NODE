var userModel = {};
userModel.init = function(_io) {
  _io.on('connection', function (socket) {
    _io.emit('user', { msg: 'Welcome bro!' });
    socket.on('user',function(msg){
      console.log(msg)
    	_io.emit('user', { msg: "you sent : "+msg });
    })
  })
};

module.exports = userModel;