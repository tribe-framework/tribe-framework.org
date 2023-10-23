import Controller from '@ember/controller';
import { service } from '@ember/service';
import ENV from 'junction/config/environment';

export default class IndexController extends Controller {
  @service types;

  get plausibleAuth() {
    return ENV.PLAUSIBLE_AUTH;
  }

  get plausibleDomain() {
    return ENV.PLAUSIBLE_DOMAIN;
  }
}
