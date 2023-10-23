import EmberRouter from '@ember/routing/router';
import config from 'junction/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('types');
  this.route('auth');
});
