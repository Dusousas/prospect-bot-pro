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
  /**
   * Indicates whether the lead has a phone number we can use with
   * WhatsApp. The backend doesn't store this explicitly; it's derived
   * from the phone value when we fetch the leads.
   */
  hasWhatsapp?: boolean;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
}
