import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { theme, style, topic } = await req.json()

    const themeDescriptions = {
      education: "educational and informative",
      planet: "about planets and space exploration",
      bedtime: "calming and suitable for bedtime",
      rhyme: "with rhyming verses and poetic structure"
    }

    const styleDescriptions = {
      ghibli: "with magical landscapes and whimsical characters",
      animation: "with vibrant 3D animated scenes",
      cartoon: "with fun cartoon characters and lively action",
      watercolor: "with dreamy watercolor visuals and soft transitions"
    }

    const prompt = `A short ${themeDescriptions[theme] || theme} story about "${topic}" ${styleDescriptions[style] || style}.`

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Generate text
    const textResult = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        return_full_text: false
      }
    })

    const storyText = textResult.generated_text || "Once upon a time..."

    // Generate video
    const videoResult = await hf.textToVideo({
      model: "damo-vilab/modelscope-text-to-video-synthesis",
      inputs: prompt
    })

    const videoBlob = await videoResult.blob()
    const buffer = await videoBlob.arrayBuffer()
    const base64Video = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    return new Response(JSON.stringify({
      story: storyText,
      videoBase64: base64Video,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
