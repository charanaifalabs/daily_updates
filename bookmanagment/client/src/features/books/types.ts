export interface Book {
  _id: string;
  title: string;
  author: string;
  publication?: string;
  language?: string;
  price?: number;
  description?: string;
  status?: "available" | "borrowed" | "sold";
}
