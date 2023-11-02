import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import videojs from 'video.js';

export default class UpstreamParticipantComponent extends Component {

  @tracked muted = this.args.muted ?? true;

  @action
  async initPlayer() {
  	if (this.args.trackType == 'video') {
	  	let player = await videojs(this.args.id+'_video');
	  	this.activateVideoTrack();
  	}
  	else if (this.args.trackType == 'audio') {
	  	let player = await videojs(this.args.id+'_audio');
	  	this.activateAudioTrack();
	}
  	else if (this.args.trackType == 'screen') {
	  	let player = await videojs(this.args.id+'_screen');
	  	this.activateScreenTrack();
	}
  }

  @action
  async activateVideoTrack() {
  	document.querySelector('#'+this.args.id+'_video_html5_api').srcObject = await this.args.videoTrack;
  }

  @action
  async activateAudioTrack() {
  	document.querySelector('#'+this.args.id+'_audio_html5_api').srcObject = await this.args.videoTrack;
  }

  @action
  async activateScreenTrack() {
  	document.querySelector('#'+this.args.id+'_screen_html5_api').srcObject = await this.args.screenTrack;
  }

  @action
  muteUnmute() {
    if (this.muted) this.muted = false;
    else this.muted = true;
    videojs(this.args.id).muted(this.muted);
  }
}
