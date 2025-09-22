import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" asChild disabled={currentPage <= 1}>
        <Link href={createPageUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Link>
      </Button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-muted-foreground">...</span>
            ) : (
              <Button variant={currentPage === page ? "default" : "outline"} size="sm" asChild>
                <Link href={createPageUrl(page as number)}>{page}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" asChild disabled={currentPage >= totalPages}>
        <Link href={createPageUrl(currentPage + 1)}>
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
