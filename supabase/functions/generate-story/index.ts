
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { theme, style, topic } = await req.json()
    
    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    // Create a prompt based on user selections
    const prompt = `Generate a short ${theme} story in the ${style} style about ${topic}. Make it engaging and suitable for a video.`
    
    console.log("Generating story with prompt:", prompt)
    
    // Text generation with a suitable model
    const textResult = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      }
    })
    
    // Generate an image for the story
    const imagePrompt = `A ${style} illustration for a ${theme} story about ${topic}`
    console.log("Generating image with prompt:", imagePrompt)
    
    let imageResult
    try {
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
    } catch (error) {
      console.error("Image generation failed:", error)
      imageResult = null
    }
    
    return new Response(
      JSON.stringify({ 
        text: textResult.generated_text,
        image: imageResult,
        imagePrompt: imagePrompt,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
