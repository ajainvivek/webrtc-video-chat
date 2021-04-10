import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

import './style.css';

const Video = () => {
  const [message, setMessage] = useState(null);
  const video1 = useRef(null);
  const video2 = useRef(null);
  const peer1 = new Peer({
    initiator: true,
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
  });
  const peer2 = new Peer();

  // load media stream
  const loadMediaStream = async (peer) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      peer.addStream(mediaStream);
    } catch (err) {
      setMessage('Failed loading stream...');
    }
  };

  // on page load get user media
  useEffect(() => {
    loadMediaStream(peer1);
    loadMediaStream(peer2);
  }, []);

  peer1.on('signal', (data) => {
    peer2.signal(data);
  });

  peer2.on('signal', (data) => {
    peer1.signal(data);
  });

  peer1.on('stream', (stream) => {
    if ('srcObject' in video1.current) {
      video1.current.srcObject = stream;
    } else {
      video1.current.src = window.URL.createObjectURL(stream); // for older browsers
    }
    video1.current.play();
  });

  peer2.on('stream', (stream) => {
    if ('srcObject' in video2.current) {
      video2.current.srcObject = stream;
    } else {
      video2.current.src = window.URL.createObjectURL(stream); // for older browsers
    }
    video2.current.play();
  });

  return (
    <div className="Video">
      {!message ? (
        <video ref={video1} height="500" width="500">
          <track kind="captions" />
        </video>
      ) : message}
      {!message ? (
        <video ref={video2} height="500" width="500">
          <track kind="captions" />
        </video>
      ) : message}
    </div>
  );
};

export default Video;
