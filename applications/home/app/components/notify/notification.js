import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Toast } from 'bootstrap';

export default class NotifyNotificationComponent extends Component {

	@action
	notify() {
        Toast.getOrCreateInstance(
          document.getElementById(this.args.notification.uniqid)
        ).show();
	}

}
