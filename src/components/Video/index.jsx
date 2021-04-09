import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

import './style.css';

const Video = () => {
  const [message, setMessage] = useState(null);
  const video = useRef(null);
  const peer1 = new Peer({
    initiator: true,
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
  });
  const peer2 = new Peer();

  // load media stream
  const loadMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      peer1.addStream(mediaStream);
    } catch (err) {
      setMessage('Failed loading stream...');
    }
  };

  // on page load get user media
  useEffect(() => {
    loadMediaStream();
  }, []);

  peer1.on('signal', (data) => {
    peer2.signal(data);
  });

  peer2.on('signal', (data) => {
    peer1.signal(data);
  });

  peer2.on('stream', (stream) => {
    if ('srcObject' in video.current) {
      video.current.srcObject = stream;
    } else {
      video.current.src = window.URL.createObjectURL(stream); // for older browsers
    }
    video.current.play();
  });

  return (
    <div className="Video">
      {!message ? (
        <video ref={video} height="500" width="500">
          <track kind="captions" />
        </video>
      ) : message}
    </div>
  );
};

export default Video;
