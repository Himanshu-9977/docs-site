"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { searchArticles } from "@/lib/sanity/queries";
import { formatDate } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await searchArticles(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter(
          (result) => result.category.title.toLowerCase() === activeTab
        );

  return (
    <div className="container">
      <header className="sticky top-0 z-40 w-full border-b bg-background px-4 md:px-6">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Docsy.</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <ModeToggle />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Search Documentation
          </h1>
          <p className="text-muted-foreground">
            Find articles, guides, and tutorials across our documentation.
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-2xl mx-auto items-center space-x-2"
        >
          <Input
            type="search"
            placeholder="Search documentation..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>

        {query && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {loading ? "Searching..." : `Results for "${query}"`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {loading ? "" : `${filteredResults.length} results found`}
              </p>
            </div>

            {results.length > 0 && (
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Array.from(
                    new Set(
                      results.map((result) =>
                        result.category.title.toLowerCase()
                      )
                    )
                  ).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-4">
                    {filteredResults.map((result) => (
                      <Card key={result._id}>
                        <CardHeader>
                          <CardTitle>{result.title}</CardTitle>
                          <CardDescription>{result.summary}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                            <span>{result.category.title}</span>
                            <span>•</span>
                            <span>Version {result.version}</span>
                            <span>•</span>
                            <span>{formatDate(result.updatedAt)}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link
                            href={`/docs/${result.category.slug.current}/${result.slug.current}`}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                          >
                            Read Article
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {!loading && results.length === 0 && query && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
