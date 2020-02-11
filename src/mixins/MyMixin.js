let MyMixin = {
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    toggleLoading() {
      this.isLoading = !this.isLoading
    },
    toast(msg, type, icon) {
      this.$toasted.show(msg, { 
        theme: "toasted-primary", 
        type,
        icon,
        position: "top-center", 
        duration : 3000
      });
    },
  }

}

export default MyMixin