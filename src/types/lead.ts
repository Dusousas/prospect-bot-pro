export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalRatings: number;
  category: string;
  city: string;
  website?: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
}
