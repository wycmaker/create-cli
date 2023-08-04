export {}

declare global {
  interface QueryCommonProp {
    title: string,
    titleWidth: string,
    width: string
  }

  interface SelectProp {
    modelValue: Array<any>|number|string|boolean,
    options: Array<any>,
    clearable: boolean,
    multiple: boolean,
    disabled: boolean,
    useLabel: boolean,
    customLabel: string,
    collapseTags: boolean
  }

  interface DateRangeProp {
    startDate: string,
    endDate: string
  }

  interface PageProp {
    totalCount: number,
    currentPage: number,
    pageSize: number
  }

  interface TableProp {
    data: Array<any>,
    classes: Array<any>,
    border: boolean,
    stripe: boolean,
    height: number
  }

  interface TableColumnProp {
    label: string,
    width: string,
    align: string,
    prop: string,
    fix: string,
    className: string
  }
}