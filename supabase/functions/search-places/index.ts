import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

    const { category, city, pageToken } = await req.json();

    if (!category || !city) {
      return new Response(
        JSON.stringify({ error: "category and city are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const query = `${category} em ${city}`;
    
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (pageToken) {
      url += `&pagetoken=${pageToken}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Maps API error:", data);
      throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || "Unknown error"}`);
    }

    const places = (data.results || []).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      total_ratings: place.user_ratings_total || 0,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
    }));

    // Fetch phone numbers for each place using Place Details
    const placesWithDetails = await Promise.all(
      places.map(async (place: any) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website&language=pt-BR&key=${GOOGLE_MAPS_API_KEY}`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();
          
          return {
            ...place,
            phone: detailsData.result?.formatted_phone_number || "",
            website: detailsData.result?.website || "",
          };
        } catch {
          return { ...place, phone: "", website: "" };
        }
      })
    );

    return new Response(
      JSON.stringify({
        places: placesWithDetails,
        nextPageToken: data.next_page_token || null,
        totalResults: placesWithDetails.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in search-places:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
