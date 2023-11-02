import Route from '@ember/routing/route';
import * as bootstrap from 'bootstrap';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service cookies;
  @service user;

  async beforeModel() {
    if (this.cookies.getCookie('tribe_user_email')) {
      await this.user.loadUser(this.cookies.getCookie('tribe_user_email'));
    }
  }
}
