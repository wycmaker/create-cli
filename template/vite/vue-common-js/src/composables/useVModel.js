/**
* @description: 撰寫共用的computed函式
* @param props 欄位列表
* @param propName 欄位名稱
* @return {function}
*/
export default function(props, propName) {
  const vm = getCurrentInstance()?.proxy
  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      vm?.$emit(`update:${propName}`, value)
    }
  })
}