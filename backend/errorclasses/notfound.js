class notfound extends Error {
  msg = "";
  statusCode = 404;
  constructor(msg) {
    super(msg);
    this.msg = msg;
    Object.setPrototypeOf(this, notfound.prototype);
  }
  summary() {
    return [{ message: this.msg }];
  }
}
module.exports = { notfound };
