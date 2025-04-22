"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter, usePathname } from "next/navigation"
import { getVersions } from "@/lib/sanity/queries"

export function VersionSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState("")

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const availableVersions = await getVersions()
        setVersions(availableVersions)

        // Set the current version based on URL or default to latest
        const currentVersion = availableVersions[0]?.version || ""
        setSelectedVersion(currentVersion)
      } catch (error) {
        console.error("Error fetching versions:", error)
      }
    }

    fetchVersions()
  }, [])

  const handleVersionChange = (version) => {
    setSelectedVersion(version)
    setOpen(false)

    // Here you would typically navigate to the same page but with a different version
    // For now, we'll just update the URL with a version query parameter
    const url = new URL(window.location.href)
    url.searchParams.set("version", version)
    router.push(url.pathname + url.search)
  }

  if (versions.length <= 1) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedVersion ? `Version ${selectedVersion}` : "Select version..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search version..." />
          <CommandList>
            <CommandEmpty>No version found.</CommandEmpty>
            <CommandGroup>
              {versions.map((version) => (
                <CommandItem
                  key={version.version}
                  value={version.version}
                  onSelect={() => handleVersionChange(version.version)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedVersion === version.version ? "opacity-100" : "opacity-0")}
                  />
                  Version {version.version}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
