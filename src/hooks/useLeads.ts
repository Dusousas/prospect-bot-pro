import { useState, useEffect, useCallback } from "react";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return;
    }

    setLeads(
      (data || []).map((d) => ({
        id: d.id,
        name: d.name,
        address: d.address || "",
        phone: d.phone || "",
        rating: Number(d.rating) || 0,
        totalRatings: d.total_ratings || 0,
        category: d.category || "",
        city: d.city || "",
        website: d.website || "",
        hasWhatsapp: Boolean(d.phone),
        status: d.status as Lead["status"],
        createdAt: d.created_at,
        notes: d.notes || "",
      }))
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const searchPlaces = async (category: string, city: string, limit?: number) => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-places", {
        body: { category, city, limit },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const places = data.places || [];

      // Save to database
      let savedCount = 0;
      for (const place of places) {
        const { error: insertError } = await supabase.from("leads").upsert(
          {
            place_id: place.place_id,
            name: place.name,
            address: place.address,
            phone: place.phone,
            rating: place.rating,
            total_ratings: place.total_ratings,
            category,
            city,
            website: place.website,
            status: "new",
          },
          { onConflict: "place_id" }
        );
        if (!insertError) savedCount++;
      }

      await fetchLeads();
      return { total: places.length, saved: savedCount };
    } catch (err: any) {
      console.error("Search error:", err);
      toast.error("Erro na busca: " + (err.message || "Tente novamente"));
      return { total: 0, saved: 0 };
    } finally {
      setIsSearching(false);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const stats = {
    totalLeads: leads.length,
    newToday: leads.filter(
      (l) =>
        l.status === "new" &&
        new Date(l.createdAt).toDateString() === new Date().toDateString()
    ).length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  return { leads, stats, isSearching, isLoading, searchPlaces, updateLeadStatus, deleteLead };
}
