import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoRoomProps {
  roomId: string;
}

type PeerConnections = { [socketId: string]: RTCPeerConnection };

const SOCKET_SERVER_URL = 'http://localhost:5001';

const VideoRoom: React.FC<VideoRoomProps> = ({ roomId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
  const peerConnections = useRef<PeerConnections>({});
  const socketRef = useRef<Socket>(null);
  const localStreamRef = useRef<MediaStream>(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = io(SOCKET_SERVER_URL);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      socketRef.current.emit('join-room', { roomId, userId: socketRef.current.id });

      socketRef.current.on('user-connected', (userId: string) => {
        callUser(userId, stream);
      });

      socketRef.current.on('signal', ({ from, data }: { from: string; data: any }) => {
        handleSignal(from, data, stream);
      });

      socketRef.current.on('user-disconnected', (userId: string) => {
        const pc = peerConnections.current[userId];
        if (pc) {
          pc.close();
          delete peerConnections.current[userId];
          setPeers(prev => { const p = { ...prev }; delete p[userId]; return p; });
        }
      });
    };

    init();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const callUser = (userId: string, stream: MediaStream) => {
    const peer = createPeer(userId, stream);
    peerConnections.current[userId] = peer;
  };

  const createPeer = (userId: string, stream: MediaStream) => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current?.emit('signal', { to: userId, from: socketRef.current?.id, data: { candidate: event.candidate } });
      }
    };

    peer.ontrack = event => {
      setPeers(prev => ({ ...prev, [userId]: event.streams[0] }));
    };

    peer.createOffer()
      .then(offer => peer.setLocalDescription(offer))
      .then(() => {
        socketRef.current?.emit('signal', { to: userId, from: socketRef.current?.id, data: { sdp: peer.localDescription } });
      });

    return peer;
  };

  const handleSignal = (from: string, data: any, stream: MediaStream) => {
    let peer = peerConnections.current[from];
    if (!peer) {
      peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.onicecandidate = event => {
        if (event.candidate) {
          socketRef.current?.emit('signal', { to: from, from: socketRef.current?.id, data: { candidate: event.candidate } });
        }
      };

      peer.ontrack = event => {
        setPeers(prev => ({ ...prev, [from]: event.streams[0] }));
      };

      peerConnections.current[from] = peer;
    }

    if (data.sdp) {
      peer.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
        if (data.sdp.type === 'offer') {
          peer.createAnswer().then(answer => {
            peer.setLocalDescription(answer).then(() => {
              socketRef.current?.emit('signal', { to: from, from: socketRef.current?.id, data: { sdp: peer.localDescription } });
            });
          });
        }
      });
    }

    if (data.candidate) {
      peer.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoOff(!videoOff);
    }
  };


return (
  <div className="relative flex flex-col h-screen bg-black text-white">
    {/* Participant Grid */}
    <div className="flex-grow p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(150px,_1fr)] overflow-y-auto">
      {Object.entries(peers).map(([id, stream]) => (
        <VideoPlayer key={id} stream={stream} />
      ))}
    </div>

    {/* Self Video - Floating in corner */}
    <video
      ref={localVideoRef}
      autoPlay
      muted
      playsInline
      className="fixed bottom-28 right-6 w-40 h-28 object-cover rounded-lg shadow-md border border-white/10 z-10"
    />

    {/* Controls */}
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center gap-6 bg-black/60 py-4 backdrop-blur-md shadow-md z-20">
      <button
        onClick={toggleMute}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition ${
          muted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        {muted ? <MicOff size={20} /> : <Mic size={20} />}
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <button
        onClick={toggleVideo}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition ${
          videoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
        {videoOff ? 'Turn Camera On' : 'Turn Camera Off'}
      </button>
    </div>
  </div>
);


};

const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline className="video-element" />;
};

export default VideoRoom;
