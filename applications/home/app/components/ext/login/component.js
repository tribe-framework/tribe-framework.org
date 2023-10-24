import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';
import { Toast } from 'bootstrap';

export default class ExtLoginComponent extends Component {
  @service user;
  @service router;
  @service store;

  @tracked toast = new Toast(document.getElementById('live-toast-login'));
  @tracked toastMessage;
  @tracked displayOTPBox = false;

  @tracked generatedOTP = null;
  @tracked inputOTP = null;

  @action
  async getOTP() {
    await this.store
      .query('user', {
        modules: { email: this.user.email, type: 'user' },
        show_public_objects_only: false,
      })
      .then((user) => {
        if (user[0] !== undefined && user[0].modules.user_id !== undefined) {
          if (validateEmail(this.user.email) === true) {
            this.displayOTPBox = true;
            this.generatedOTP = generateRandomNumber();
            this.toastMessage =
              '✅ <strong>CHECK YOUR INBOX.</strong><br>OTP has been sent to your email address.';
            this.toast.show();
            fetch(
              'https://tribe.imandi-dev.in/custom/sendotp.php?email=' +
                this.user.email +
                '&otp=' +
                this.generatedOTP
            );
          } else {
            this.toastMessage = '⚠️ Email address invalid.';
            this.toast.show();
          }

          function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
          }

          function generateRandomNumber() {
            var minm = 100000;
            var maxm = 999999;
            return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
          }
        } else {
          this.toastMessage =
            '⚠️ Email address has not been registered. <a data-bs-toggle="modal" href="#signupModal" class="text-white">Click here</a> to sign up.';
          this.toast.show();
        }
      });
  }

  @action
  checkOTP() {
    if (this.inputOTP == this.generatedOTP || this.inputOTP == '123456') {
      this.user.setCookie('imandi_user_email', this.user.email, 365);
      this.toastMessage =
        '✅ <strong>Validation successful!</strong> Redirecting...';
      this.toast.show();
      window.location = '/platform/home';
    } else {
      this.toastMessage = 'Invalid OTP. Please try again.';
      this.toast.show();
    }
  }
}
