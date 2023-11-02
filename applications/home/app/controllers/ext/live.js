import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import {
  connect,
  createLocalTracks,
  createLocalVideoTrack,
  createLocalAudioTrack,
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  Participant,
  RoomOptions,
  VideoPresets,
  RoomConnectOptions,
  ParticipantEvent,
  MediaDeviceFailure,
  MediaDevicesError,
  MediaDevicesChanged,
  RoomMetadataChanged,
  Track,
  VideoQuality,
} from 'livekit-client';
import ENV from 'home/config/environment';
import videojs from 'video.js';

export default class ExtLiveController extends Controller {
  queryParams = ['roomName'];
  @tracked roomName = '';
  @service user;

  @tracked token = '';
  @tracked wsURL = 'wss://level-x-arena-rlki1hmw.livekit.cloud';

  @tracked room = new Room({
    // automatically manage subscribed video quality
    adaptiveStream: true,

    // optimize publishing bandwidth and CPU for published tracks
    dynacast: true,

    // default capture settings
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
    },
  });

  @tracked isConnected = false;
  @tracked myScreenShared = false;
  @tracked participants = [];

  @tracked btnText =
    this.roomName != '' ? 'Join iMandi Meet' : 'Start Instant Meeting';

  uuid = () => {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };

  @action
  async connect() {
    this.btnText =
      '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

    if (this.roomName == '') this.roomName = this.uuid();

    var resp = await fetch(
      ENV.TribeENV.API_URL + '/custom/livekit/get-access-token.php',
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.uuid(),
          room_name: this.roomName,
        }),
      }
    ).then(async (response) => {
      return response.json();
    });

    this.token = resp.token;
    this.roomName = resp.roomName;

    this.room.prepareConnection(this.wsURL, this.token);

    // set up event listeners
    this.room
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
      .on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakerChange)
      .on(RoomEvent.Disconnected, this.handleDisconnect)
      .on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished);

    await this.room.connect(this.wsURL, this.token);
    await this.room.localParticipant.enableCameraAndMicrophone();

    //OR
    //this.room.localParticipant.setMicrophoneEnabled(true);
    //this.room.localParticipant.setCameraEnabled(true);

    this.isConnected = true;

    this.participants = this.room.participants;
    this.participants = this.participants;

    this.btnText = 'Join iMandi Meet';
  }

  handleTrackSubscribed = (track, publication, participant) => {
  	this.participants.push(participant);
  	this.participants = this.participants;
  };

  handleActiveSpeakerChange = (speakers) => {
    speakers.forEach((speaker) => {
      //console.log(speaker.sid);
    });
  };

  handleTrackUnsubscribed = (track, publication, participant) => {
    track.detach();
  };

  handleLocalTrackUnpublished = (publication, participant) => {
    publication.track.detach();
  };

  handleDisconnect = () => {};

  getVideoTrack = async (sid)=>{
  	if (sid == this.room.localParticipant.sid) {
  		var p = await this.room.localParticipant.getTrack(Track.Source.Camera);
  	}
  	else {
  		var p = await this.room.participants.get(sid).getTrack(Track.Source.Camera);
  	}

  	if (p.isSubscribed) {
		return p.videoTrack.mediaStream;
	}
	else {
		return null;
	}
  }

  getScreenTrack = async (sid)=>{
  	if (sid == this.room.localParticipant.sid) {
  		var p = await this.room.localParticipant.getTrack(Track.Source.ScreenShare);
  	}
  	else {
  		var p = await this.room.participants.get(sid).getTrack(Track.Source.ScreenShare);
  	}

  	if (p.isSubscribed) {
		return p.videoTrack.mediaStream;
	}
	else {
		return null;
	}
  }

  @action
  disconnect() {
    this.isConnected = false;
    this.roomName = '';
    this.room.disconnect();
    this.btnText = 'Start Instant Meeting';
  }

  @action
  async shareScreen() {
  	this.myScreenShared = false;
    await this.room.localParticipant.setScreenShareEnabled(true);
    this.myScreenShared = true;
  }

  @action
  copyURLToClipboard() {
    navigator.clipboard.writeText(
      'https://imandi-workshop.netlify.app/ext/live/?roomName=' + this.roomName
    );
  }
}
