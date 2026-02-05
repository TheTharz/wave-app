export interface ItemTax {
  id: number;
  name: string;
  amount: number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  taxes: ItemTax[];
  created_at: string;
  updated_at: string;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
