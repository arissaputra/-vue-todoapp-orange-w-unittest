<template>
  <div class="row">
    <aside class="col-sm-4 offset-sm-4 mt-5">
      <div class="card">
        <article class="card-body">
          <router-link to="/signup" class="float-right btn btn-outline-primary">Sign up</router-link>
          <h4 class="card-title mb-4 mt-1">Sign in</h4>
          <hr />
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-user"></i>
                  </span>
                </div>
                <input
                  class="form-control"
                  placeholder="Email or login"
                  type="email"
                  v-model="form.username"
                  required
                />
              </div>
              <!-- input-group.// -->
            </div>
            <!-- form-group// -->
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
                <input
                  class="form-control"
                  placeholder="******"
                  type="password"
                  v-model="form.password"
                  required
                />
              </div>
              <!-- input-group.// -->
            </div>
            <!-- form-group// -->
            <div class="form-group">
              <button :disabled="isLoading" type="submit" class="btn btn-primary btn-block">
                <font-awesome-icon v-if="isLoading" icon="spinner" spin/> {{isLoading ? ' Attempting to login ..':' Login'}}
              </button>
            </div>
            <!-- form-group// -->
          </form>
        </article>
      </div>
    </aside>
  </div>
</template>

<script>
import MyMixin from "../mixins/MyMixin";
export default {
  data() {
    return {
      form: {
        username: null,
        password: null
      }
    };
  },
  mixins: [ MyMixin ],
  methods: {
    login() {
      return this.$store.dispatch("login", {
        credentials: this.form
      });
    },
    showMsg(msg, type = "error", icon = "warning") {
      this.toast(msg, type, icon)
    },
    async onSubmit() {
      this.toggleLoading()
      const res = await this.login();
      if (res.statusCode) {
        this.showMsg("Username or Password is Incorrect !");
      } else {
        const identity = await this.$store.dispatch("storeIdentity", res.access_token);
        this.showMsg(`Welcome ${identity}!`, 'info', 'user');        
        this.$router.push("/");
      }
      this.toggleLoading()
    }
  }
};
</script>

<style>
</style>