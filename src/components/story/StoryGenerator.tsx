"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface StoryData {
  title: string;
  story: string;
  videoUrl: string;
  thumbnail: string;
}

export default function VideoPlayer() {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      const videoId = searchParams.get("videoId");

      if (videoId) {
        const { data } = await axios.get(`/api/get-story?videoId=${videoId}`);
        setStoryData(data);
        setVideoBase64(data?.videoBase64 || null); // If API returns base64
      }
    };

    fetchStory();
  }, [searchParams]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  if (!storyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{storyData.title}</h1>
      <p className="mb-6 max-w-xl text-center">{storyData.story}</p>

      <div className="w-full max-w-2xl relative">
        {videoBase64 ? (
          <video
            controls
            autoPlay
            ref={videoRef}
            poster={storyData?.thumbnail}
            className="w-full h-full rounded-lg"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              setIsPlaying(true);
            }}
            muted={isMuted}
          >
            <source src={`data:video/mp4;base64,${videoBase64}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : storyData?.videoUrl ? (
          <video
            ref={videoRef}
            src={storyData.videoUrl}
            poster={storyData.thumbnail}
            className="w-full h-full rounded-lg"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              setIsPlaying(true);
            }}
            muted={isMuted}
            controls
          />
        ) : null}

        <div className="flex justify-between items-center mt-4">
          <button onClick={togglePlay} className="px-4 py-2 bg-blue-500 text-white rounded">
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button onClick={toggleMute} className="px-4 py-2 bg-gray-500 text-white rounded">
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-32"
          />
        </div>
        <div className="text-sm mt-2 text-center text-gray-600">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </div>
      </div>
    </div>
  );
}
