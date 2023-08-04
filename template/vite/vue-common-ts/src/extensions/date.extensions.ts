interface Date {
  addYear(years: number) : Date,
  addMonth(months: number) : Date,
  addDay(days: number): Date,
  formatString(delimiters: string) : string
}

Date.prototype.addYear = function (this:Date, years:number) {
  this.setFullYear(this.getFullYear() + years);
  return this;
}

Date.prototype.addMonth = function (this:Date, months:number) {
  this.setMonth(this.getMonth() + months);
  return this;
}

Date.prototype.addDay = function (this:Date, days:number) {
  this.setDate(this.getDate() + days);
  return this;
}

Date.prototype.formatString = function (this:Date, delimiters:string) {
  let year = this.getFullYear()
  let month = this.getMonth() + 1
  let day = this.getDate()
  return year + delimiters + month.toString().padStart(2, '0') + delimiters + day.toString().padStart(2, '0')
}