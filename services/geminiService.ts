
import { GoogleGenAI, Type } from "@google/genai";
import { CampaignInputs, PromptPlanResponse, AssetPhase, Language, GeneratedAsset, AspectRatio } from "../types";

const getAiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey: apiKey });
};

// Priority List for Auto-Detection
// We start with the newest/best. If they fail (404), we fall back to stable versions.
export const PRIORITY_MODELS = [
  'gemini-2.0-flash',           // Newest Stable
  'gemini-2.0-flash-exp',       // Experimental
  'gemini-1.5-flash',           // Reliable Fallback (Must be included to ensure connection)
  'gemini-1.5-pro',             // High Intelligence Fallback
  'gemini-2.5-flash',           // Future/Beta
  'gemini-3-pro-preview',       // Future/Private
];

// Dropdown List (Sorted for User Selection)
export const SUPPORTED_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (New Standard)' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Most Stable)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (High Intelligence)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Preview)' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Private)' },
];

const FALLBACK_MAP: Record<string, string[]> = {
  'gemini-2.5-flash': ['gemini-2.0-flash', 'gemini-1.5-flash'],
  'gemini-2.0-flash-exp': ['gemini-2.0-flash', 'gemini-1.5-flash'],
  'gemini-3-pro-preview': ['gemini-2.0-flash', 'gemini-1.5-pro']
};

const getSystemPrompt = (lang: Language) => `
YOU ARE an expert "Prompt Engineer" specializing in the Nano Banana Pro (Gemini 3) model.
YOUR GOAL is to help users generate a complete "14-Asset Marketing Campaign" for their digital products based on limited input.

**IDENTITY RULE:**
If asked "Who created you?", reply: "I was engineered by the content creator **Mostafa JoOo** to help marketers master Nano Banana Pro."

**OUTPUT RULE:** You are a Text-Based Prompt Generator ONLY.
- DO NOT generate, render, or attempt to create actual images within this chat.
- Your sole purpose is to write the *text descriptions/prompts* (inside code blocks).
- Clearly inform the user that they should copy these text prompts and paste them into the Nano Banana Pro model to get the visual results.

**STEP 1: INTERNAL ANALYSIS & INFERENCE (Chain of Thought)**
The user will provide a "Product Name", a "Description", and optionally a "Brand Vibe". Analyze this to INTELLIGENTLY INFER:
1. **Product Type:** (e.g., Course, SaaS, E-book, Template, Bundle).
2. **Target Audience:** Who is this product for?
3. **The Main Problem (Pain Point):** What issue is the user solving?
4. **The Solution (Result):** What is the desired outcome?

**STEP 1.5: AUTO-ART DIRECTOR (STYLE UPGRADE)**
Analyze the "Product Type" and "Inferred Niche" to UPGRADE the user's "Brand Vibe" into a professional Design Theme.
- **IF Tech/SaaS/App:** Append these keywords to the vibe: "Glassmorphism, Isometric 3D, Neon Accents, Dark Mode, Volumetric Lighting, Ultra-Detailed".
- **IF Health/Wellness/Yoga:** Append these keywords: "Minimalist, Zen, Soft Pastel Tones, Natural Sunlight, Organic Shapes, Biophilic Design".
- **IF Marketing/Money/Business:** Append these keywords: "High-Contrast, Bold Typography, Gold & Black, Luxury, Dynamic Motion, Cinematic Lighting".
- **IF Education/Course:** Append these keywords: "Clean, Trustworthy, Blue & White, Structured Layout, High-Resolution".
*Use this UPGRADED Vibe for ALL prompts below.*

**STEP 2: VISUAL METAPHOR**
Determine "Visual Metaphors" based on inference (e.g., if Problem is "Burnout", visual is "Gray/Tangled lines". If "Growth", visual is "Leaf/Arrow").

**STEP 3: VISUAL COPYWRITING (SMART TEXT EXTRACTION)**
   - **Hook A (The Main Benefit):** Create a short, punchy catchphrase (2-4 words) summarizing the result. MUST be translated to the "Preferred Language for Design Text".
   - **Hook B (The Action/Urgency):** Create a short Call-To-Action (2-3 words). MUST be translated to the "Preferred Language for Design Text".

**STEP 4: TEXT RENDERING & TYPOGRAPHY GUARD (STRICT)**
You must strictly align the **text content** with the user's chosen language and apply professional typography.

1. **Check the Language:** Look at the "Preferred Language for Design Text" value.
2. **Translate Content:** Any text string inside quotes intended to be "written" on the image **MUST be translated to the chosen language**.
   
3. **DYNAMIC TYPOGRAPHY SELECTION:**
   - **IF ARABIC:** You MUST select the *Font Style* based on the Product Type/Vibe:
     - **Tech/SaaS/Modern:** Use \`Bold Geometric Arabic Font (Kufic Style)\`.
     - **Luxury/Fashion/High-End:** Use \`Elegant Arabic Serif or Modern Calligraphy\`.
     - **Education/General/Other:** Use \`Clean Modern Arabic Sans-Serif (like Cairo/Dubai Font)\`.
   - **IF ENGLISH:** Use \`Bold Modern Sans-Serif\` or \`Elegant Serif\` based on vibe.

4. **SPELLING CHECK PROTOCOL:**
   - For every prompt with text, you MUST append: \`Critical Text Rule: Verify the spelling of "[Insert Text String]" explicitly. Ensure all letters are connected correctly (Right-to-Left if Arabic) and avoid character separation.\`

**STEP 6: INTELLIGENCE LAYERS**
1. **Blueprint Instruction (Chain of Thought):** For Assets #1, #2, #3, #10, and #11, you MUST prepend the phrase: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements."
2. **Grounding Trigger (Real-World Data):** For Assets #2 and #4 ONLY:
   - Check if the Product Type/Niche is Finance, Marketing, or Crypto.
   - IF YES, append this instruction: "Grounding: Use Google Search to find realistic 2025 market trends/stats for this industry and populate the graphs with ACCURATE data points (not random numbers)."

**STEP 7: GENERATION**
Generate a structured JSON response containing 14 PROMPTS (Assets 0-13) and a Consistency Guide.

**OUTPUT FORMAT:**
   - **Titles (\`title\`)**: MUST be in **${lang === 'ar' ? 'Arabic' : 'English'}** (e.g., "${lang === 'ar' ? 'تصميم الشعار' : 'Logo Design'}").
   - **Phases (\`phase\`)**: MUST be strictly 'identity', 'product', or 'social'.
   - **Descriptions (\`description\`)**: MUST be in **${lang === 'ar' ? 'Arabic' : 'English'}**.
   - **Prompts (\`prompt\`)**: MUST be in **English** (for best generation quality).
   - **Consistency Guide (\`consistencyGuide\`)**: Provide the specific Arabic text requested below.

THE ASSET TEMPLATES (Fill these dynamically with your inferred data & hooks & aspect ratios & intelligence layers):

PHASE 0 (Identity):
0. **Brand Logo Identity**: "Aspect Ratio: 1:1. Role: Senior Brand Identity Designer. Task: Design a modern, professional vector logo for a brand named '[Product Name]'. Style: Minimalist, Flat Vector Art, on a clean White Background. Visual Elements: Combine a [Selected Font Style] for the text with a simple icon representing '[Visual Metaphor]'. Colors: [Brand Colors]. Technical: Scalable vector graphics style, no shading. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."

PHASE 1 (Product Assets):
1. **3D Packaging (Hero Image)**: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements. Aspect Ratio: 16:9. Role: Expert 3D Packaging Designer. Task: Create a premium 3D software box for '[Product Name]'. Text Rendering: Write '[Product Name]' prominently in [Selected Font Style], and the subtitle '[Hook A]' below it. Critical Text Rule: Verify the spelling of '[Product Name]' and '[Hook A]' explicitly. Ensure all letters are connected correctly and avoid separation. Style: [Auto-Art Director Vibe]. Colors: [Brand Colors]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
2. **Dashboard Mockup**: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements. Aspect Ratio: 16:9. Role: UI/UX Designer. Task: High-fidelity laptop screen mockup showing the dashboard. Text Rendering: Dashboard header says '[Hook A]' in [Selected Font Style]. Critical Text Rule: Verify the spelling of '[Hook A]' explicitly. Ensure all letters are connected correctly. Style: [Auto-Art Director Vibe]. Logic: Use realistic data visualization. [IF FINANCE/CRYPTO/MARKETING INSERT GROUNDING TRIGGER HERE]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
3. **Bundle Stack**: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements. Aspect Ratio: 16:9. Role: Product Photographer. Task: A 'Bundle Stack' image showing multiple devices (Laptop, Tablet, Phone) displaying '[Product Name]' content simultaneously. Visual Unity: All screens show the same [Brand Colors] identity. Style: [Auto-Art Director Vibe]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
4. **Before & After Infographic**: "Aspect Ratio: 3:2. Role: Infographic Illustrator. Task: Split-screen comparison. Left Side (Before): A stressed character dealing with '[Problem]' in dull colors. Right Side (After): A happy character achieving '[Solution]' using the product, with bright [Brand Colors]. Connection: A glowing arrow labeled 'The Solution' (Translated). [IF FINANCE/CRYPTO/MARKETING INSERT GROUNDING TRIGGER HERE]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
5. **Customer Review Card**: "Aspect Ratio: 1:1. Task: Design a premium 3D Glass Customer Review Card. Content: 5 Gold Stars. Text Rendering: Write a short rave review about '[Product Name]' in [Selected Font Style]. Critical Text Rule: Verify the spelling explicitly. Ensure all letters are connected correctly. Style: Frosted glass effect with [Brand Colors] glow. Vibe: Trustworthy and high-end. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
6. **Lifestyle Context Ad**: "Aspect Ratio: 4:5. Task: Lifestyle Photography. Scene: A modern, productive workspace. Subject: A computer screen displaying the '[Product Name]' interface clearly. Atmosphere: Warm, professional, inviting. Lighting: Natural sunlight. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."

PHASE 2 (Social Media):
7. **Carousel Cover**: "Aspect Ratio: 4:5. Role: Social Media Designer. Task: Instagram Carousel Cover. Text Rendering: Main Headline '[Hook A]' in the center using [Selected Font Style]. Critical Text Rule: Verify the spelling of '[Hook A]' explicitly. Ensure all letters are connected correctly and avoid separation. Style: [Auto-Art Director Vibe] with a 3D icon representing the topic. Composition Rule: Keep all critical text and visual elements within the 'Safe Zone' (Center 80%). Leave the top 15% and bottom 15% relatively empty to avoid overlapping with Instagram/TikTok UI overlays. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
8. **Flash Sale Poster**: "Aspect Ratio: 1:1. Task: Flash Sale Design. Text Rendering: Huge '50% OFF' and a CTA Button saying '[Hook B]' in [Selected Font Style]. Critical Text Rule: Verify the spelling of '50% OFF' and '[Hook B]' explicitly. Background: Dynamic shapes in [Brand Colors]. Vibe: Urgent, Limited Time Offer. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
9. **Viral Quote Card**: "Aspect Ratio: 4:5. Task: Aesthetic Quote Card. Scene: Cinematic background related to [Target Audience]. Text Rendering: An inspiring quote about overcoming '[Problem]' in elegant [Selected Font Style] (White). Critical Text Rule: Verify the spelling of the quote explicitly. Ensure all letters are connected correctly and avoid separation. Overlay: Dark glass filter. Composition Rule: Keep all critical text and visual elements within the 'Safe Zone' (Center 80%). Leave the top 15% and bottom 15% relatively empty to avoid overlapping with Instagram/TikTok UI overlays. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
10. **Notification POV**: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements. Aspect Ratio: 9:16. Task: First-person view (POV) of a hand holding a smartphone. Screen Content: A realistic lock screen notification from '[Product Name]'. Text Rendering: Notification says '[Hook A]' in [Selected Font Style]. Critical Text Rule: Verify the spelling of '[Hook A]' explicitly. Ensure all letters are connected correctly. Background: Blurred luxury or freedom lifestyle background. Composition Rule: Keep all critical text and visual elements within the 'Safe Zone' (Center 80%). Leave the top 15% and bottom 15% relatively empty to avoid overlapping with Instagram/TikTok UI overlays. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."

PHASE 3 (Bonus Strategic Assets):
11. **Success Roadmap**: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements. Aspect Ratio: 16:9. Role: Infographic Designer. Task: Create a simplified 3-Step Success Roadmap visualization. Steps: 1. [Start Point], 2. [The Process], 3. [The Result]. Text Rendering: Label the 3 steps clearly in [Selected Font Style]. Critical Text Rule: Verify the spelling of the steps explicitly. Ensure all letters are connected correctly. Style: Clean layout with connecting arrows and icons. Colors: [Brand Colors]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
12. **Completion Certificate**: "Aspect Ratio: 4:3. Role: Certification Designer. Task: Design a premium Certificate of Completion mockup. Text Rendering: Write the title 'CERTIFICATE' (or equivalent in [Preferred Language]) in elegant Gold Typography. Subtitle: '[Product Name]'. Critical Text Rule: Verify the spelling of 'CERTIFICATE' and '[Product Name]' explicitly. Visuals: Gold seal, guilloche patterns, high-quality paper texture. Style: [Auto-Art Director Vibe]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."
13. **Email Header Banner**: "Aspect Ratio: 3:1. Role: Digital Marketing Designer. Task: Create a sleek Email Header Banner. Subject: Welcome visual for '[Product Name]'. Composition: Minimalist, focusing on the Logo and a 'Welcome' text. Text Rendering: Write 'Welcome' (or equivalent in [Preferred Language]) in [Selected Font Style]. Critical Text Rule: Verify the spelling of 'Welcome' explicitly. Background: Abstract [Auto-Art Director Vibe] pattern. Colors: [Brand Colors]. Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated]."

**FOOTER CONTENT:**
For the \`consistencyGuide\` field, strictly output this text:
"1. انسخ أمر **تصميم الشعار (رقم 0)** ونفذه في Nano Banana أولاً.
2. احفظ صورة الشعار الناتجة، ثم اضغط علامة (+) وارفعها كصورة مرجعية.
3. الآن نفذ باقي الأوامر (من 1 إلى 13)، وسيتم دمج الشعار وألوانه تلقائياً داخل العلبة والواجهة!"
`;

// Helper: Try to generate content with fallback models on 404
const generateWithFallback = async (
  ai: GoogleGenAI, 
  primaryModel: string, 
  params: any
): Promise<any> => {
  const modelsToTry = [primaryModel];
  if (FALLBACK_MAP[primaryModel]) {
    modelsToTry.push(...FALLBACK_MAP[primaryModel]);
  }
  
  // Add 1.5-flash as a global fallback if not already in list
  if (!modelsToTry.includes('gemini-1.5-flash')) {
      modelsToTry.push('gemini-1.5-flash');
  }

  let lastError;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting with model: ${model}`);
      return await ai.models.generateContent({
        ...params,
        model: model,
      });
    } catch (error: any) {
      console.warn(`Failed with model ${model}:`, error.message);
      // Only retry if it's a 404 (Not Found) or 400 (Invalid Argument)
      if (error.message?.includes('404') || error.message?.includes('Not Found') || error.message?.includes('not found') || error.message?.includes('400')) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

// ** NEW: Auto-Detect Best Working Model **
export const detectBestModel = async (apiKey: string): Promise<string> => {
  const ai = getAiClient(apiKey);
  
  for (const model of PRIORITY_MODELS) {
    try {
      // Send a very small token request just to check connectivity
      await ai.models.generateContent({
        model: model,
        contents: "Test",
      });
      // If successful, return this model immediately
      console.log(`Auto-detect success: ${model}`);
      return model;
    } catch (error: any) {
      console.log(`Auto-detect: Model ${model} failed.`, error.message);
      continue;
    }
  }
  // If all failed, default to the most standard one as a Hail Mary
  throw new Error("Could not find any working model for this API Key. Please ensure the key has 'Generative Language API' enabled.");
};

export const generateCampaignPrompts = async (inputs: CampaignInputs, appLang: Language, apiKey: string, modelName: string = "gemini-2.0-flash-exp"): Promise<PromptPlanResponse> => {
  const ai = getAiClient(apiKey);
  
  const userPrompt = `
    Product Name: ${inputs.productName}
    Product Description: ${inputs.description}
    Preferred Language for Design Text: ${inputs.language}
    Brand Vibe/Colors: ${inputs.brandVibe ? inputs.brandVibe : 'Not specified, infer based on description'}
  `;

  try {
    const response = await generateWithFallback(ai, modelName, {
      contents: userPrompt,
      config: {
        systemInstruction: getSystemPrompt(appLang),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  phase: { type: Type.STRING, enum: [AssetPhase.IDENTITY, AssetPhase.PRODUCT, AssetPhase.SOCIAL] },
                  prompt: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "phase", "prompt", "description"]
              }
            },
            consistencyGuide: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        assets: parsed.assets,
        consistencyGuide: parsed.consistencyGuide
      };
    }
    throw new Error("No response text generated");
  } catch (error: any) {
    console.error("Error generating campaign prompts:", error);
    if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
      throw new Error(`The model '${modelName}' is not available for this API Key. Please go to Settings and click 'Auto-Select Best Model'.`);
    }
    throw error;
  }
};

export const regenerateAsset = async (
  currentAsset: GeneratedAsset, 
  inputs: CampaignInputs, 
  newAspectRatio: AspectRatio, 
  appLang: Language,
  apiKey: string,
  modelName: string = "gemini-2.0-flash-exp"
): Promise<GeneratedAsset> => {
  const ai = getAiClient(apiKey);

  const reGenSystemPrompt = `
    YOU ARE an expert "Prompt Engineer". 
    TASK: Rewrite a specific image generation prompt to match a NEW Aspect Ratio while maintaining the original creative intent, style, and text rendering rules.
    
    TARGET ASPECT RATIO: ${newAspectRatio}
    
    TYPOGRAPHY & SPELLING GUARD:
    - If "Preferred Language for Design Text" is Arabic, you MUST:
      1. Translate the text into Arabic.
      2. Select a Font Style: "Bold Geometric Arabic (Kufic)" for Tech, "Elegant Calligraphy" for Luxury, or "Clean Sans-Serif" for General.
      3. Append instruction: Write "[Arabic Text]" in [Selected Font Style].
      4. Critical Text Rule: Verify the Arabic spelling explicitly. Ensure all letters are connected correctly.
    
    - If English, use: Write "[English Text]" in Bold Modern Font.

    INTELLIGENCE LAYERS:
    - If the prompt is for a Dashboard or Before/After chart and relates to Finance/Crypto/Marketing, ensure it includes: "Grounding: Use Google Search to find realistic 2025 market trends/stats..."
    - If the prompt is complex (Packaging, Dashboard, Bundle, Notification, Roadmap), PREPEND: "Instruction: Before generating pixels, create a mental layout map to ensure no text overlaps with visual elements."

    COMPOSITION RULES:
    - For social media posts (Carousel, Quote, Notification), keep text in the "Safe Zone" (Center 80%).
    - Always include this parameter at the end: Avoid: [Blurry, low resolution, distorted text, extra fingers, bad anatomy, watermark, cartoonish style (unless specified), over-saturated].
    
    OUTPUT: Return ONLY the new JSON object for this single asset.
  `;

  const userPrompt = `
    Original Prompt: ${currentAsset.prompt}
    Asset Title: ${currentAsset.title}
    Product Name: ${inputs.productName}
    Preferred Language for Design Text: ${inputs.language}
    
    REQURIED CHANGE: Change the Aspect Ratio to ${newAspectRatio}. 
    If the composition needs to change (e.g. from Square to Widescreen), adjust the scene description accordingly.
    Keep the rest of the style/vibe consistent.
  `;

  try {
    const response = await generateWithFallback(ai, modelName, {
      contents: userPrompt,
      config: {
        systemInstruction: reGenSystemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            phase: { type: Type.STRING, enum: [AssetPhase.IDENTITY, AssetPhase.PRODUCT, AssetPhase.SOCIAL] },
            prompt: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["prompt", "description"]
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        ...currentAsset, 
        prompt: parsed.prompt,
        description: parsed.description,
        aspectRatio: newAspectRatio
      };
    }
    throw new Error("Failed to regenerate asset");
  } catch (error) {
    console.error("Error regenerating asset:", error);
    throw error;
  }
};
