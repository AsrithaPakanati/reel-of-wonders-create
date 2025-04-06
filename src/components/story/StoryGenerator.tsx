
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Theme } from "./ThemeSelector";
import { Style } from "./StyleSelector";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StoryData {
  title: string;
  story: string;
  videoUrl: string;
  thumbnail: string;
  videoBase64?: string;
}

interface StoryGeneratorProps {
  theme: Theme;
  style: Style;
  topic: string;
  onBack: () => void;
  onFinish: () => void;
}

export function StoryGenerator({ theme, style, topic, onBack, onFinish }: StoryGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const generateStory = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.post('/api/generate-story', {
          theme,
          style,
          topic
        });
        
        setStoryData({
          title: topic,
          story: data.story,
          videoUrl: '',
          thumbnail: '',
          videoBase64: data.videoBase64
        });
        
        setVideoBase64(data.videoBase64 || null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error generating story:', err);
        setError('Failed to generate story. Please try again.');
        setIsLoading(false);
      }
    };

    generateStory();
  }, [theme, style, topic]);

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

  const handleSaveStory = async () => {
    if (!user || !storyData) return;
    
    setIsSaving(true);
    
    try {
      // Generate a simple thumbnail from the first frame or use a placeholder
      const thumbnail = videoBase64 ? 
        `data:image/png;base64,${videoBase64.substring(0, 100)}` : 
        'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&auto=format&fit=crop';
      
      // Insert story data into Supabase
      const { error: supabaseError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: storyData.title,
          theme: theme,
          style: style,
          story: storyData.story,
          video_base64: videoBase64,
          video_url: storyData.videoUrl,
          thumbnail: thumbnail
        });
      
      if (supabaseError) {
        console.error('Error saving story:', supabaseError);
        setError('Failed to save story. Please try again.');
      } else {
        onFinish();
      }
    } catch (err) {
      console.error('Error in save operation:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Generating your story...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

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
      
      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
        <button 
          onClick={handleSaveStory} 
          disabled={isSaving} 
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Story'
          )}
        </button>
      </div>
    </div>
  );
}

// Also export the component as default for backward compatibility
export default StoryGenerator;
