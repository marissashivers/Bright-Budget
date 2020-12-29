<template>
  <div>
    <form class="mt-3" @submit.prevent="login()">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="card bg-light">
              <div class="card-body">
                <h3 class="font-weight-light mb-3">Log in</h3>
                <section class="form-group">
                  <div
                    class="col-12 alert alert-danger px-3"
                    v-if="error"
                  >
                    {{ error }}
                  </div>
                  <!-- e-mail -->
                  <label
                    class="form-control-label sr-only"
                    for="Email"
                  >Email</label>
                  <input
                    required
                    class="form-control"
                    type="email"
                    id="email"
                    placeholder="Email"
                    v-model="email"
                  />
                </section>
                <section class="form-group">
                  <input
                    required
                    class="form-control"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  />
                </section>
                <div class="form-group text-right mb-0">
                  <button
                    class="btn btn-primary"
                    type="submit"
                  >Log in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <p class="text-center mt-2">
      or
      <router-link to="/register">register</router-link>
    </p>
  </div>
</template>

<script>
//import { auth } from "../firebase"

export default {
  name: 'Login',
    data: function() {
        return {
            email: '',
            password: '',
            error: ""
        }
    },
    methods: {
        login: function() {
            const info = {
                email: this.email,
                password: this.password
            }
            this.$store.dispatch('signInAction', info)
            .then(response => {
              console.log("Successfully signed in: " + response);
              this.$router.push({path: '/'});
              this.$store.dispatch("fetchPurchases");
              this.$store.dispatch("fetchCategories");
              this.$store.dispatch("fetchBudgets");
            }, error => {
              var errorCode = error.code
              var errorMessage = error.message
              console.log(errorCode)
              console.log(errorMessage)
              this.error = error.message;
            });
        },
    },
}
</script>