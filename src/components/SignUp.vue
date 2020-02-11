<template>
  <div class="row">
    <aside class="col-sm-4 offset-sm-4 mt-5">
      <div class="card">
        <article class="card-body">
          <router-link to="/login" class="float-right btn btn-outline-primary">Login</router-link>
          <h4 class="card-title mb-4 mt-1">Sign up</h4>
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
                  v-model="form.email"
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
                <font-awesome-icon v-if="isLoading" icon="spinner" spin/> {{isLoading ? ' Signing up ..':' Sign up'}}
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
        name: "default",
        email: null,
        password: null
      }
    };
  },
  mixins: [ MyMixin ],
  methods: {
    signup() {
      return this.$store.dispatch("signup", {
        credentials: this.form
      });
    },
    showMsg(msg, type = "error") {
      this.toast(msg, type, 'warning')
    },
    async onSubmit() {
      this.toggleLoading()
      const res = await this.signup();
      // console.log(res);

      if (res.statusCode) {
        if (res.statusCode == 409) {
          return this.showMsg(res.message);
        }
        const msgArr = Object.values(res.message[0].constraints);
        for (let index = 0; index < msgArr.length; index++) {
          const msg = msgArr[index];
          this.showMsg(msg);
        }
      } else {
        this.showMsg("Sign up success !", "info");
        this.$router.push("/login");
      }
      this.toggleLoading()
    }
  }
};
</script>

<style>
</style>