import Service from '@ember/service';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import ENV from 'home/config/environment';
import { service } from '@ember/service';

export default class UserService extends Service {
  @service store;
  @service cookies;

  @tracked email = '';
  @tracked mobile = '';
  @tracked profile_photo_url = '';
  @tracked name = '';
  @tracked agreeToTerms = false;
  @tracked role_slug = 'visitor';
  @tracked user_id = null;
  @tracked currentUser = null;

  get isLoggedIn() {
    if (this.cookies.getCookie('tribe_user_email')) {
      return fetch(ENV.TribeENV.API_URL + '/custom/auth/current-user.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: this.currentUser.modules,
        }),
      }).then((response) => {
        if (this.cookies.getCookie('tribe_user_email')) return true;
        else return false;
      });
    } else return false;
  }

  @action
  copyUserIDToClipboard() {
    navigator.clipboard.writeText('#' + this.user_id);
  }

  @action
  logout() {
    this.cookies.eraseCookie('tribe_user_email');

    fetch(ENV.TribeENV.API_URL + '/custom/auth/logout.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: this.currentUser.modules,
      }),
    }).then((response) => {
      window.location = '/';
    });
  }

  @action
  async saveProfile() {
    let vvv = {
      name: this.name,
      email: this.email.toLowerCase(),
      profile_photo_url: this.profile_photo_url,
      mobile: this.mobile,
      role_slug: this.role_slug,
    };

    if (
      this.currentUser != null &&
      this.currentUser.modules !== undefined &&
      this.currentUser.modules.email
    ) {
      await this.store
        .findRecord('user', this.currentUser.id)
        .then(async (user) => {
          if (this.profile_photo_url == null) {
            await fetch(
              ENV.TribeENV.API_URL +
                '/custom/erase-profile-photo.php?id=' +
                this.currentUser.id
            );
          }

          user.modules = vvv;
          user.save();
          this.currentUser = user;
        });
    } else {
      let user = await this.store.createRecord('user', {
        modules: vvv,
      });

      user.save().then((user) => {
        this.currentUser = user;
        this.user_id = user.modules.user_id;
      });
    }
  }

  @action
  async loadUser(email) {
    this.email = email.toLowerCase();
    let user = await this.store.query('user', {
      modules: { email: email, type: 'user' },
      show_public_objects_only: false,
    });
    if (user[0] !== undefined && user[0].modules.user_id !== undefined) {
      this.currentUser = user[0];
      this.name = this.currentUser.modules.name;
      this.mobile = this.currentUser.modules.mobile;
      this.user_id = this.currentUser.modules.user_id;
      this.role_slug = this.currentUser.modules.role_slug;
      this.profile_photo_url = this.currentUser.modules.profile_photo_url;
    }
  }
}
