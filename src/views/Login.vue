<template>
  <div>
    <!-- New Testing Stuff -->
    <b-container>
      <b-card title="Log In">
        <div v-if="validationErrors.length">
          <b-alert variant="danger" show>
              Please resolve the following error(s) before proceeding:
              <ul style="margin-top:0.3em; margin-left:1em">
                <li v-for="(error, index) in validationErrors" :key="`error-${index}`" v-html="error" />
              </ul>
          </b-alert>
        </div>
        <b-form>
          <b-form-group label="E-mail address:">
            <b-form-input 
              v-model="email"
              type="email" 
              placeholder="Enter e-mail" 
              required 
            />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input 
              v-model="password"
              type="password"
              placeholder="Enter password" 
              required />
          </b-form-group>
          <b-button 
            @click.prevent="validate()"
            type="submit" 
            variant="primary">Submit
          </b-button>
        </b-form>
      </b-card>
    </b-container>



  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: 'Login',
  data: function() {
      return {
          email: null,
          password: null,
          validationErrors: [],
          error: ""
      }
  },
  methods: {
    ...mapActions(["signInAction"]),
    validate() {
      // Clear errors before we validate again
      this.validationErrors = [];

      // email validation
      if (!this.email) {
        this.validationErrors.push("<strong>E-mail</strong> cannot be empty");
      }
      if (/.+@.+/.test(this.email) != true) {
        this.validationErrors.push("<strong>E-mail</strong> must be valid.");
      }
      // password validation
      if (!this.password) {
        this.validationErrors.push("<strong>Password</strong> cannot be empty");
      }
      if (/.{6,}/.test(this.password) != true) {
        this.validationErrors.push(
          "<strong>Password</strong> must be at least 6 characters long"
        );
      }
      // when valid then sign in
      if (this.validationErrors.length <= 0) {
        this.signIn();
      }
    },
    signIn() {
      console.log("sign in", this.email, this.password);
      this.signInAction({ email: this.email, password: this.password });
    },
  },
}
</script>