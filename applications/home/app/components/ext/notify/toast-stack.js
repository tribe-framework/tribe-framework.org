import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { A } from '@ember/array';

export default class ExtNotifyToastStackComponent extends Component {
  @service pusher;
  @service user;
  @service store;

  @tracked pusherChannel = null;
  @tracked notifications = A([]);

  @action
  initNotifications() {
    later(
      this,
      () => {
        /*this.pusherChannel = this.pusher.channel.subscribe('presence-'+this.user.currentUser.slug);

        //loop below binding code for each pusher event that is in list of subscribed topics of the user
        this.pusherChannel.bind('notify', (data) => {
          this.notify(data);
        });
        */
      },
      2000
    );
  }

  @action
  async notify(data) {
    if (data.sender_type == 'user')
      data['user'] = await this.store.findRecord(
        data.sender_type,
        data.sender_id
      );
    else
      data['object'] = await this.store.findRecord(
        data.sender_type,
        data.sender_id
      );

    this.notifications.push(data);
    this.notifications = this.notifications;
    later(
      this,
      () => {
        const index = this.notifications.indexOf(data);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
        this.notifications = this.notifications;
      },
      10000
    );
  }
}
