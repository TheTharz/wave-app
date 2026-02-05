export interface EstimateCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface EstimateItem {
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Estimate {
  id: number;
  estimate_number: string;
  user_id: number;
  customer_id: number;
  customer: EstimateCustomer;
  issue_date: string;
  expiry_date: string;
  notes: string;
  footer_note?: string;
  total: number;
  items: EstimateItem[];
  created_at: string;
  updated_at: string;
}

export interface EstimatesResponse {
  estimates: Estimate[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
