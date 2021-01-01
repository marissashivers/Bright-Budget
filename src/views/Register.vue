<template>
  <div>
    <b-container>
      <b-card title="Log In">
        <div v-if="validationErrors.length || getError">
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
          <b-form-group label="Repeat Password">
            <b-form-input
              v-model="passwordRepeat"
              type="password"
              placeholder="Repeat password"
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
import { mapActions, mapGetters } from "vuex";
export default {
  data: function() {
    return {
        email: null,
        password: null,
        passwordRepeat: null,
        validationErrors: [],
        firebaseError: null
    }
  },
  computed: {
    ...mapGetters(['getError']),
  },
  methods: {
    ...mapActions(["signUpAction"]),
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
      if(!(this.password === this.passwordRepeat)) {
        this.validationErrors
            .push("<strong>Passwords</strong> did not match");
      }
      // when valid then sign up
      if (this.validationErrors.length <= 0) {
        this.signUpAction({ email: this.email, password: this.password })
        .then(() => {
          if (!this.getError) {
            this.validationErrors = [];
            this.$router.push({ path: "/"});
            console.log("Registration successful");
          }
          else {
             this.validationErrors.push(this.getError);
          }
        });
      }
    },
    // signUp() {
    //   console.log("sign up", this.email, this.password);
    //   this.signUpAction({ email: this.email, password: this.password });
    // },
  },
}
</script>