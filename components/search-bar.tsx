"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Loader2 } from "lucide-react"
import { searchArticles } from "@/lib/sanity/queries"

export function SearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchArticles(query)
        setResults(searchResults.slice(0, 5)) // Limit to 5 results for the dropdown
      } catch (error) {
        console.error("Error searching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (article) => {
    setOpen(false)
    router.push(`/docs/${article.category.slug.current}/${article.slug.current}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-sm text-muted-foreground"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                <span>Search documentation...</span>
              </div>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            align="start"
            sideOffset={4}
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search documentation..."
                value={query}
                onValueChange={setQuery}
                ref={inputRef}
                className="h-9"
              />
              <CommandList>
                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {!loading && query && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                {!loading && results.length > 0 && (
                  <CommandGroup heading="Results">
                    {results.map((article) => (
                      <CommandItem key={article._id} onSelect={() => handleSelect(article)}>
                        <div className="flex flex-col">
                          <span>{article.title}</span>
                          <span className="text-xs text-muted-foreground">{article.category.title}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {query && (
                  <CommandGroup>
                    <CommandItem onSelect={() => router.push(`/search?q=${encodeURIComponent(query)}`)}>
                      <span>View all results</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  )
}
