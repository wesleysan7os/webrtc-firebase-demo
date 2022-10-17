import "./style.css";

import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  "type": "service_account",
  "projectId": "webrtc-caf7c",
  "private_key_id": "50b4292ccdf6df8eaf48315a21d9989c9b6e985a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5AqlHHP/lmbSq\nqgfVcYGFvXBbeTlvr/5vziT1jFJGgG2nSqqg05p1x+Y3BHXZAw6noAtePuCrvhJD\nUsisrV7tBrOeSiZWwOhjg/uW/jyL+b6K+xQO/U+DyFrD/u1VDxPHVAaPPOb12Sa/\nk1pIsf2muOwbzLeP9BpvqRUBmR3G4B8JU6jSATGDRqWfY5OWAcQdhYbSJftIchPi\n7k6ROuobAVWnFoZ+/rAA7ibpYSioRV6dM4x0ZYjIxq0Uoh4fhetdZbEWJj/FK4Jb\njMgyEGG3qf+FtTyPKJz6vW6z6jGlrvnKmDWsUcdGGh7i6vzlLnrZKEwnkPvqu7S5\nFZsknpJZAgMBAAECggEAA4JrP0frthQW1b/uRccRQRNeshWCwz1wPaMIQhzRzg2P\nRu5HKKWAQhNd02sDE0VCvhJD9PCLZtFEW8DnwULJUK9hBokl4LJoa27W/b5qhps2\nWUDkWK5xwjBcQb3bDFMsubS8f8i/dtK820MfzM43igtAS1IJpLI+3XcJyM3PP0pR\nJD76S3qPuBoAufnaCWjdEsxIvhIRFr7JLIdXCYM1yZdgkEL/67yzRfZ9/iMRpPd2\n2unCLQCM3arrN+2EYdYQMPHMg+lXFmuDI/hfsQxmMeFOEYQDdKfgQ4gYjGvTxiGy\n+nGPjY4RSO8NWZh8M02SiCY92fRP5CVw9YhbsW9UmwKBgQDg7NX4F0xb90KxkVNw\nw/4I4GF+D2gD0fdOTwQv0SxAC0pBTV4//q9XQN5TIN+x08ylgH39GYtzW+GXRTnY\nHcXYFdx8P5iadwYm7Pau3vozlPPJ2mq+h+CpIWcGhyLyZxw3FZxBR1SwfOBU7mmg\ntkl+98qE0z3kJQe26pEvBsCM3wKBgQDSkh5fZcqn5pyC1Z+Ph5fLpTJoCAG3u7JJ\nELPhI+FeFNRSyTcw5h2CsPC1Et3VIvm86aaLHTMAjDShW0BCkhTGFwrhFgIYz3Jc\nZYXMJxpROQU6IilydjTrxKu/JASJ1ROCmbDlPDDGZ/WadXLiYy2A9zTvwOHmW9K4\np8WwSVAPxwKBgCbm748MQIm7d06M6xia3WodnN8XvQ7EFvj1U60NiZC+IyauQfnh\ni+QUdR99lRMFpeSOF7xZ2bOnFZp7P6jwZVKdXVgkC7nTkj3TSEswh6e6QHwOCd5Q\nU/wMqewIHXQ9fzTLyQ3FT5GC16342k4QmR+brexROOgnu3DYmym+CjmTAoGAAVpI\n8anwvFVh6gE/Tie71OYRxdNPV4PQKGIAFdEqMHWHy6RZQ2onBGDomvEtFaJs4kbJ\n+BjO7BD6gZLZfdP8aC1bt4hxqQEkJe3NBzu1EpKAMxhnFcImouEXjVnI4a3Ju0wL\nc92IHq4qSLy6aTPj5fEwmN2vVdB/MQp63aAK8J8CgYBZfyK9nPe1u9ThiCHVyWgg\nbkPJ34nM41q4Fr+Pw0fkTVklhEsJhUM6t8w6CZtWt5osJijjngUCWovQxSIPsdGN\nR0sIOtsppK6BTgwnMdaBZNttHoUlfGvex3CkHSc3oXAvvRT/ZkCLmQxGgqajPfqX\n9+TwGhSItYffCZEUiC4jbw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-iv0sy@webrtc-caf7c.iam.gserviceaccount.com",
  "client_id": "101598735567737811340",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iv0sy%40webrtc-caf7c.iam.gserviceaccount.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById("webcamButton");
const webcamVideo = document.getElementById("webcamVideo");
const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const remoteVideo = document.getElementById("remoteVideo");
const hangupButton = document.getElementById("hangupButton");

// 1. Setup media sources

webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;
};

// 2. Create an offer
callButton.onclick = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection("calls").doc();
  const offerCandidates = callDoc.collection("offerCandidates");
  const answerCandidates = callDoc.collection("answerCandidates");

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };

  // Create offer
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await callDoc.set({ offer });

  // Listen for remote answer
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      console.log('data', data.answer)
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });

  hangupButton.disabled = false;
};

// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
  const callId = callInput.value;
  const callDoc = firestore.collection("calls").doc(callId);
  const answerCandidates = callDoc.collection("answerCandidates");
  const offerCandidates = callDoc.collection("offerCandidates");

  pc.onicecandidate = (event) => {
    event.candidate && answerCandidates.add(event.candidate.toJSON());
  };

  const callData = (await callDoc.get()).data();

  const offerDescription = callData.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change);
      if (change.type === "added") {
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};
