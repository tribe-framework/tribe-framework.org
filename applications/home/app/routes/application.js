import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  async model() {
    //You can use the following after connecting Tribe in config/environment.js
    //For more info https://github.com/wil-ldf-ire/ember-tribe#ember-tribe

    //findRecord for type+slug pair and findAll all objects in a type
    //return await this.store.findRecord('types_json', 'webapp');

    //this.store.findAll('film');
    //this.store.query('film', {page: {limit: 2, offset: 0}});
  }
}
