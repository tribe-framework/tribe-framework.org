import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { A } from '@ember/array';

export default class ExtStatusComponent extends Component {
  @service pusher;
  @service user;
  @service store;

  @tracked presenceChannel = null;

  @action
  async initAuth() {
    later(
      this,
      async () => {
        await this.pusher.authenticate();

        this.pusher.auth.user.watchlist.bind('online', (event) => {
          console.log(event);
        });

        this.pusher.auth.user.watchlist.bind('offline', (event) => {
          console.log(event);
        });
      },
      1000
    );
  }
}
