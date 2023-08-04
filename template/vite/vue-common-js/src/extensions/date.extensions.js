Date.prototype.addYear = function (years) {
  this.setFullYear(this.getFullYear() + years);
  return this;
}

Date.prototype.addMonth = function (months) {
  this.setMonth(this.getMonth() + months);
  return this;
}

Date.prototype.addDay = function (days) {
  this.setDate(this.getDate() + days);
  return this;
}

Date.prototype.formatString = function (delimiters) {
  let year = this.getFullYear()
  let month = this.getMonth() + 1
  let day = this.getDate()
  return year + delimiters + month.toString().padStart(2, '0') + delimiters + day.toString().padStart(2, '0')
}