export default {
  modelValue: {
    type: [ Array, Number, String, Boolean, null ],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    typs: Boolean,
    default: false
  },
  useLabel: { 
    type: Boolean,
    default: false
  },
  customLabel: {
    type: String,
    default: ''
  },
  collapseTags: {
    typs: Boolean, 
    default: false
  }
}