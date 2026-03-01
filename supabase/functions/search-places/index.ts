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

    const { category, city, pageToken, limit } = await req.json();

    if (!category || !city) {
      return new Response(
        JSON.stringify({ error: "category and city are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const textQuery = `${category} em ${city}`;

    // Use Places API (New) - Text Search
    const searchUrl = "https://places.googleapis.com/v1/places:searchText";
    const maxCount = Math.max(1, Math.min(Number(limit) || 20, 60));
    const searchBody: any = {
      textQuery,
      languageCode: "pt-BR",
      maxResultCount: maxCount,
    };

    if (pageToken) {
      searchBody.pageToken = pageToken;
    }

    const searchRes = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.location,nextPageToken",
      },
      body: JSON.stringify(searchBody),
    });

    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      console.error("Places API error:", searchData);
      throw new Error(`Places API error [${searchRes.status}]: ${JSON.stringify(searchData)}`);
    }

    const places = (searchData.places || []).map((place: any) => ({
      place_id: place.id,
      name: place.displayName?.text || "",
      address: place.formattedAddress || "",
      rating: place.rating || 0,
      total_ratings: place.userRatingCount || 0,
      phone: place.nationalPhoneNumber || "",
      website: place.websiteUri || "",
      lat: place.location?.latitude,
      lng: place.location?.longitude,
    }));

    return new Response(
      JSON.stringify({
        places,
        nextPageToken: searchData.nextPageToken || null,
        totalResults: places.length,
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
