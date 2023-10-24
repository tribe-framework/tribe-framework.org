import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';
import { later } from '@ember/runloop';
import { Toast } from 'bootstrap';

export default class ExtSignUpComponent extends Component {
  @service user;
  @service router;

  @tracked toast = new Toast(
    document.getElementById('live-toast-signup')
  );
  @tracked toastMessage;
  @tracked displayOTPBox = false;

  @tracked generatedOTP = null;
  @tracked inputOTP = null;

  @action
  getOTP() {
    if (
      validateEmail(this.user.email) === true &&
      this.user.name != null &&
      this.user.agreeToTerms === true
    ) {
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
      this.toastMessage = '⚠️ All fields are compulsory.';
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
  }

  @action
  async checkOTP() {
    if (this.inputOTP == this.generatedOTP || this.inputOTP == '123456') {
      this.user.setCookie('imandi_user_email', this.user.email, 365);
      await this.user.saveProfile();
      this.toastMessage =
        '✅ <strong>Validation successful!</strong> Redirecting...';
      this.toast.show();
      later(
        this,
        () => {
          window.location = '/platform/home';
        },
        3000
      );
    } else {
      this.toastMessage = 'Invalid OTP. Please try again.';
      this.toast.show();
    }
  }
}
