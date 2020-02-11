<template>
  <div class="container">
    <router-view></router-view>
    
    <div class="row mt-2">
      <div class="col-12">
        <p class="text-center text-muted">
          <small>
            Created using this <a href="https://documenter.getpostman.com/view/1538901/SWLiZRfB?version=latest">API</a>

          </small>
        </p>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  created() {
    const token = localStorage.getItem('token')
    if (token) {
      this.$store.dispatch('storeIdentity', token)
      
    }
    
  }
}
</script>

<style>
  .my-custom-li {
    background-color: #f1fcfc
  }
  .my-custom-card {
    background-color: #72b5b7
    /* background-color: #5b8c85 */
    /* background-color: #8DE79E */
  }
  
</style>