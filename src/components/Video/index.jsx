import React, {
  useState, useEffect, useRef,
} from 'react';
import Peer from 'simple-peer';
import { v4 as uuid } from 'uuid';
import { filter, find } from 'lodash';

import './style.css';

const Video = () => {
  const videoRef = useRef();
  // host connection
  const hostConnection = {
    id: uuid(),
    peer: new Peer({
      initiator: true,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    }),
    video: useRef(null),
  };
  // peer connection
  const peerConnection = {
    id: uuid(),
    peer: new Peer({
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    }),
    video: useRef(null),
  };

  const [connections] = useState([hostConnection, peerConnection]);

  // load media stream
  const loadMediaStream = async (connection) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      connection.peer.addStream(mediaStream);
    } catch (err) {
      // TODO: Need to display the message inline to video element
      console.log('Failed loading stream...');
    }
  };

  // get peer stats
  const getBandwidthStats = ({ peer }) => {
    peer.getStats((_, reports) => {
      // TODO: Display the report in DOM
      const transport = find(reports, { type: 'transport' });
      console.log(transport);
    });
  };

  // bind peer connections
  const bindPeer = (connection) => {
    const { peer, video } = connection;
    const signalConnections = filter(connections, (conn) => conn.id !== connection.id);

    // signal to other peer to perform handshake
    peer.on('signal', (data) => {
      signalConnections.forEach((conn) => {
        conn.peer.signal(data);
      });
    });

    // load the stream to video
    peer.on('stream', (stream) => {
      if ('srcObject' in video.current) {
        video.current.srcObject = stream;
      } else {
        video.current.src = window.URL.createObjectURL(stream); // for older browsers
      }
      video.current.play();
    });
  };

  // on page load get user media
  useEffect(() => {
    connections.forEach((connection) => {
      loadMediaStream(connection);
      bindPeer(connection);
    });
  });

  return (
    <div ref={videoRef} className="VideoWrapper">
      {connections.map((connection) => {
        const { video, id } = connection;
        return (
          <div key={`${id}-video-wrapper`}>
            <video key={`${id}-video`} ref={video} className="Video">
              <track key={`${id}-track`} kind="captions" />
            </video>
            <button
              key={`${id}-stats`}
              type="submit"
              onClick={() => {
                getBandwidthStats(connection);
              }}
            >
              Show Peer (
              {`${connection.id}`}
              ) Stats - Check Console
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Video;
