"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useWebSocketLogs } from "./useWebSocketLogs";

export function useScraper() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
   const logs = useWebSocketLogs(); // Subscribe to WebSocket logs
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // console.log(BACKEND_URL);
  // console.log(logs);
  const scrape = async (values: any) => {


    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/scrape?url=${encodeURIComponent(
          values?.url
        )}&max_pages=${values?.pageCount}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        setIsScraping(true);
        toast.success("Scraping started.");
      } else {
        toast.error("Failed to start scraping.");
      }
    } catch (error) {
      console.error("Scraping failed:", error);
      toast.error("Failed to scrape website.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopScraping = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stop-scraping`, {
        method: "POST",
      });

      if (response.ok) {
        setIsScraping(false);
        toast.success("Scraping stopped.");
      } else {
        toast.error("Could not stop scraping.");
      }
    } catch (error) {
      console.error("Failed to stop scraping:", error);
      toast.error("Stop request failed.");
    }
  };

  return { products, isLoading, isScraping, scrape, stopScraping,logs };
}
