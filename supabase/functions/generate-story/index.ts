
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map of themed video URLs organized by style and theme
const videoLibrary = {
  ghibli: {
    education: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    planet: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    bedtime: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    rhyme: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  animation: {
    education: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    planet: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    bedtime: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    rhyme: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  },
  cartoon: {
    education: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    planet: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    bedtime: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    rhyme: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
  },
  watercolor: {
    education: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    planet: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    bedtime: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rhyme: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  }
}

// Fallback video if style or theme doesn't match
const fallbackVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { theme, style, topic } = await req.json()
    
    // Create a prompt based on user selections
    const prompt = `Generate a short ${theme} story in the ${style} style about ${topic}. Make it engaging and suitable for a video.`
    
    console.log("Generating story with prompt:", prompt)
    
    let generatedText = ""
    try {
      // Initialize Hugging Face client
      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
      
      // Text generation with Mistral model
      const textResult = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: `<s>[INST] ${prompt} [/INST]`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        }
      })
      
      generatedText = textResult.generated_text || ""
      
      // Clean up the response by removing the instruction part if it exists
      if (generatedText.includes("[/INST]")) {
        generatedText = generatedText.split("[/INST]")[1].trim()
      }
    } catch (textError) {
      console.error("Text generation failed:", textError)
      // Fallback text generation
      generatedText = `Once upon a time, there was a fascinating story about ${topic}. 
      It was a ${theme} tale told in the beautiful ${style} style. 
      The characters were vivid and the plot was engaging. 
      Everyone who heard this story was captivated by its magic.`
    }
    
    // Generate an image for the story
    const imagePrompt = `A ${style} illustration for a ${theme} story about ${topic}`
    console.log("Generating image with prompt:", imagePrompt)
    
    let imageResult = null
    try {
      // Initialize Hugging Face client (again if text generation failed)
      const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
      
      // Using an image generation model
      const image = await hf.textToImage({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: imagePrompt,
        parameters: {
          negative_prompt: 'low quality, blurry',
        }
      })
      
      // Convert the blob to a base64 string
      const arrayBuffer = await image.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      imageResult = `data:image/png;base64,${base64}`
    } catch (imageError) {
      console.error("Image generation failed:", imageError)
      // We'll return null for the image and let the frontend handle the fallback
    }

    // Get appropriate video URL from our library
    let videoUrl = fallbackVideo;
    try {
      // Safely access the video library
      if (videoLibrary[style] && videoLibrary[style][theme]) {
        videoUrl = videoLibrary[style][theme];
      }
    } catch (videoError) {
      console.error("Error selecting video:", videoError);
    }
    
    return new Response(
      JSON.stringify({ 
        text: generatedText,
        image: imageResult,
        imagePrompt: imagePrompt,
        videoUrl: videoUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    // Return a fallback response that the frontend can use
    return new Response(
      JSON.stringify({ 
        error: 'Story generation failed',
        text: 'Once upon a time in a land far away... (AI-generated story unavailable at this moment, please try again later)',
        image: null,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
