import { useState } from "react";
import { Lead } from "@/types/lead";
import { mockLeads, mockStats } from "@/data/mockData";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [stats] = useState(mockStats);
  const [isSearching, setIsSearching] = useState(false);

  const searchPlaces = async (category: string, city: string) => {
    setIsSearching(true);
    // Simulate API call - will be replaced with real Google Maps API
    await new Promise((r) => setTimeout(r, 2000));

    const newLeads: Lead[] = [
      {
        id: Date.now().toString(),
        name: `${category} Exemplo - ${city}`,
        address: `Rua Principal, 100 - ${city}`,
        phone: "(00) 0000-0000",
        rating: 4.0 + Math.random(),
        totalRatings: Math.floor(Math.random() * 500),
        category,
        city,
        status: "new",
        createdAt: new Date().toISOString(),
      },
    ];

    setLeads((prev) => [...newLeads, ...prev]);
    setIsSearching(false);
    return newLeads;
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return { leads, stats, isSearching, searchPlaces, updateLeadStatus, deleteLead };
}
