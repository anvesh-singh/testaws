//@ts-nocheck
import { useState } from 'react';
import VideoRoom from './VideoRoom';
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export function Lobby (){
    const [roomId, setRoomId] = useState('');
    const [joined, setJoined] = useState(false);
    const navigate = useNavigate();
  
    const handleJoin = async () => {
      // const id = Cookies.get("jwt");
      // const courseId = Cookies.get("course");
      // const response = await axios.get("",{
      //   token : id,
      //   roomId
      // });
      // if(response.data.status !== "joined"){
      //   alert('join this course to attend this class');
      //   reutrn ;
      // }
      if (roomId.trim()) setJoined(true);
    };

    return (
        <div className="app">
        {!joined ? (
          <div className="join-container">
            <h1>Join a Room</h1>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoin}>Join</button>
          </div>
        ) : (
          <VideoRoom roomId={roomId} />
        )}
      </div>        
    )
}