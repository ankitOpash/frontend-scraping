import { ScraperForm } from '@/components/scraper-form';
import { DataTable } from '@/components/data-table';

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight"> Scraper</h1>
          {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter a website URL to scrape product information. Support for pagination and real-time progress tracking.
          </p> */}
        </section>
        
        <ScraperForm />
        <DataTable />
      </div>
    </main>
  );
}