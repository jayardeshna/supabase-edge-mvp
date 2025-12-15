import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
  "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please sign in" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: experiences, error: dbError } = await supabaseClient
      .from("experiences")
      .select("id, title, latitude, longitude, category, image_path")
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    const experiencesWithImages = await Promise.all(
      (experiences || []).map(async (exp) => {
        if (exp.image_path) {
          const { data: signedUrlData, error: urlError } =
            await supabaseClient.storage
              .from("experience-images")
              .createSignedUrl(exp.image_path, 3600);

          if (urlError) {
            console.error(
              `Error creating signed URL for ${exp.image_path}:`,
              urlError
            );
            return {
              ...exp,
              image_url: null,
            };
          }

          return {
            ...exp,
            image_url: signedUrlData?.signedUrl || null,
          };
        }

        return { ...exp, image_url: null };
      })
    );

    return new Response(
      JSON.stringify({
        data: experiencesWithImages,
        count: experiencesWithImages.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
