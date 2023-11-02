import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'home/config/environment';
import { service } from '@ember/service';

export default class PusherService extends Service {
  @service user;

  @tracked presenceAuth = null;
  @tracked socketID = null;

  @tracked channel = null;
  @tracked auth = null;

  subscribe = (channel) => {
    return this.channel.subscribe(channel);
  };

  @action
  send(
    user_slugs,
    event,
    message,
    sender_type,
    sender_id,
    action_route = null,
    action_message = null
  ) {
    //channel can be an array
    //sender can be a user or any object
    fetch(ENV.TribeENV.API_URL + '/custom/pusher/publish.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_slugs: user_slugs,
        event: event,
        message: message,
        sender_type: sender_type,
        sender_id: sender_id,
        action_route: action_route,
        action_message: action_message,
      }),
    }).then((response) => {
      //do something awesome that makes the world a better place
    });
  }

  @action
  async authenticate() {
    this.auth = await new Pusher(ENV.PUSHER_API_KEY, {
      cluster: ENV.PUSHER_CLUSTER,
      userAuthentication: {
        endpoint: ENV.TribeENV.API_URL + '/custom/pusher/authenticate.php',
        params: {
          user_id: this.user.currentUser.id,
        },
      },
    });

    this.channel = await new Pusher(ENV.PUSHER_API_KEY, {
      cluster: ENV.PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: ENV.TribeENV.API_URL + '/custom/pusher/authorize.php',
        params: {
          user_id: this.user.currentUser.id,
          channel_name: 'presence-' + this.user.currentUser.slug,
        },
      },
    });

    this.auth = await this.auth;
    await this.auth.signin();

    this.auth.bind('pusher:signin_success', (event) => {
      //console.log(event);
    });

    /*
    this.channel.bind('pusher:error', (event) => {
        console.log(event);
    });
    */
  }
}
