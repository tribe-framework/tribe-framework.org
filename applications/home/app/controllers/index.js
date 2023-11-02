import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class IndexController extends Controller {
  @service user;
  @service pusher;

  slugs = () => {
    if (this.user.currentUser !== null)
      return [
        this.user.currentUser.slug,
        this.user.currentUser.slug,
        this.user.currentUser.slug,
      ];
    else return [];
  };
}
