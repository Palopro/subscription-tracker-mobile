export type BillingCycle = "weekly" | "monthly" | "yearly";

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  icon_url: string | null;
  price: number;
  currency: string;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  category: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface NewSubscription {
  name: string;
  price: number;
  currency: string;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  category?: string;
  notes?: string;
}
