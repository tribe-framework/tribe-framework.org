import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ExtAvatarComponent extends Component {
  @tracked innerColor = 'var(--bs-light)';
  @tracked outerColor = 'var(--bs-primary)';
  @tracked isPhotoAvailable = false;

  @service store;
  @tracked currentUser = null;

  @action
  userColors() {
    if (this.args.userSlug !== undefined) {
      this.innerColor = '#' + this.args.userSlug;
      this.outerColor =
        '#' + this.args.userSlug.substr(3, 3) + this.args.userSlug.substr(3, 3);
    }
  }

  @action
  async getUser() {
    if (this.args.userSlug !== undefined) {
      let usr = await this.store.query('user', {
        modules: {
          slug: this.args.userSlug,
        },
        show_public_objects_only: false,
      });
      this.currentUser = usr[0];
      this.currentUser = this.currentUser;

      if (this.currentUser.id !== undefined) this.isPhotoAvailable = true;
      else this.isPhotoAvailable = false;
    } else {
      this.isPhotoAvailable = false;
    }
  }
}
