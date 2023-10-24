import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';

export default class ExtOfflineAlertComponent extends Component {
  @tracked offlineAlert = null;
  @service channel;

  @action
  initOfflineDetector() {
    this.offlineAlert = new Modal(document.getElementById('offlineAlert'));

    window.addEventListener('offline', (e) => {
      this.offlineAlert.show();
      this.channel.isInternetDisconnected = true;
    });

    window.addEventListener('online', (e) => {
      this.offlineAlert.hide();
      this.channel.isInternetDisconnected = false;
    });
  }
}
