import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { A } from '@ember/array';

export default class ApplicationController extends Controller {
  @tracked notifications = A([]);

  @tracked pusher = new Pusher('b51a408e93891e70b902', { cluster: 'ap2' });
  @tracked pusherChannel = null;

  @action
  initNotifications() {
    this.pusherChannel = this.pusher.subscribe('user-slug-comes-here');
    this.pusherChannel.bind('notify', (data) => {
      this.notify(data);
    });
  }

  @action
  notify(data) {
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
