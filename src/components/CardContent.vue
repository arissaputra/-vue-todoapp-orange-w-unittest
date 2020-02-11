<template>
  <div class="row">
    <v-dialog />
    <div class="col-md-6 col-xs-12 offset-md-3">
      <div class="row">
        <nav class="navbar navbar-expand-lg navbar-light bg-light col-12">
          <a class="navbar-brand">
            <img src="../assets/notepad32.png" alt srcset />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link">
                  {{$store.state.userEmail}}
                  <span class="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <button
                @click="logout"
                class="btn btn-outline-danger my-2 my-sm-0"
                type="button"
              >Logout</button>
            </form>
          </div>
        </nav>
      </div>
      <div class="row">
        <ul class="nav nav-tabs col-12 mt-3 my-custom-nav">
          <li class="nav-item">
            <router-link to="/" exact class="nav-link text-dark" active-class="active">Todos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/create" class="nav-link text-dark" active-class="active">Create</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'edit'}" class="nav-link disabled" active-class="active">Edit</router-link>
          </li>
        </ul>
      </div>
      <div class="row">
        <!-- Card -->
        <div class="mt-3 col-12" style="padding:0px">
          <div class="card">
            <div class="card-body my-custom-card">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyMixin from '../mixins/MyMixin'
export default {
  mixins: [ MyMixin ],
  methods: {
    logout() {
      this.$modal.show("dialog", {
        title: "Are you sure ?",
        buttons: [
          {
            title: "Close"
          },
          {
            title: "Logout",
            handler: async () => {
              await this.$store.dispatch("logout");
              this.toast(`Successfully logout!`, 'info', 'check')
              this.$router.push("/login");
            }
          }
        ]
      });
    }
  }
};
</script>