interface String {
  getPath() : string
}

String.prototype.getPath = function (this:string) {
  return this.substring(2, this.length);
}