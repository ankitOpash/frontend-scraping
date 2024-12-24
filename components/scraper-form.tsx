"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useScraper } from "@/hooks/use-scraper";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  hasPagination: z.boolean().default(false),
  pageCount: z.number().min(1).optional(),
});

export function ScraperForm() {
  const { isLoading, scrape, stopScraping, isScraping, logs } = useScraper();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      hasPagination: false,
      pageCount: undefined,
    },
  });
  // console.log(logs, "logs");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { hasPagination, pageCount, url } = values;

    await scrape(values);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the URL of the e-commerce website you want to scrape
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasPagination"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Has Pagination</FormLabel>
                  <FormDescription>
                    Check this if the website has multiple pages to scrape
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("hasPagination") && (
            <FormField
              control={form.control}
              name="pageCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Pages</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      // name="pageCount"
                      min={1}
                      {...field}
                      value={field.value} // Ensure a default value is always set
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(isNaN(value) ? 1 : value); // Default to 1 if NaN
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    How many pages should be scraped?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="mt-4">
            <h3>Logs:</h3>
            <div className="border p-2 max-h-60 overflow-y-auto">
              {Array.from(new Set(logs)).map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>

          {!isScraping && (
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Scraping..." : "Start Scraping"}
            </Button>
          )}

          {isScraping && (
            <Button
              type="button"
              onClick={() => stopScraping()}
              className="mt-4 w-full bg-red-500 hover:bg-red-600"
            >
              Stop Scraping
            </Button>
          )}
        </form>
      </Form>
    </Card>
  );
}
