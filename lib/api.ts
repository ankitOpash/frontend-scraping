import { z } from 'zod';

export const API_BASE_URL = 'http://127.0.0.1:8000';

export type ScrapingProgress = {
  progress: number;
  message: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  url: string;
  additionalDetails?: {
    brand?: string;
    category?: string;
    availability?: string;
    rating?: number;
    reviewsCount?: number;
  };
};

export async function startScraping(data: {
  url: string;
  hasPagination: boolean;
  pageCount?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/api/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: data.url,
      has_pagination: data.hasPagination,
      page_count: data.pageCount || 1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start scraping');
  }

  return response.json();
}