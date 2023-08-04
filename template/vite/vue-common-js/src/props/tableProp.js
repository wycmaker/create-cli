export default {
  data: {
    type: Array,
    default: () => []
  },
  classes: {
    type: Array,
    default: () => []
  },
  border: {
    type: Boolean,
    default: false
  },
  stripe: {
    type: Boolean,
    default: false
  },
  height: {
    type: [ Number, null ],
    default: null
  }
}