## WebRTC Simple Video Chat

A 2-way local demonstration video conferencing application that can run in the browser. 

This is an expiremental project using WebRTC libraries.

## TODO:

- [x] Setup react boilerplate + add test framework
- [x] Capture a local video and audio stream using the `getUserMedia` API
- [x] Add this video stream to a WebRTC PeerConnection
- [ ] Connect this to another WebRTC PeerConnection object to receive this video stream and display it in another <video> element on the page
- [ ] Using the `getStats` API, report on the bandwidth being utilized by the PeerConnection.
- [ ] Add in support for using a STUN server (stun.l.google.com:19302 as a freely available one), and filter out any non STUN (srflx) ICE candidates when establishing the connection. 