function throwErr(next, err, code, msg){
   if (err) {
    var err = new Error(msg || 'data error');
    err.status = 200;
    err.code=code || "S400"
    next(err);
  };
}
module.exports = throwErr