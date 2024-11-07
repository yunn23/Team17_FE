import { InfiniteQueryObserverResult } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  hasNextPage: boolean | undefined
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>
}

const useIntersectionObserver = ({
    threshold = 0.1,
    hasNextPage,
    fetchNextPage
}: UseIntersectionObserverProps) => {
    const [target, setTarget] = useState<HTMLDivElement | null | undefined>(null)

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasNextPage) {
              fetchNextPage()
            }
          })
        },
        [hasNextPage, fetchNextPage]
    )

    useEffect(() => {
        if (!target) return
        
        const observer = new IntersectionObserver(observerCallback, {
            threshold
        })

        observer.observe(target)
        
    }, [observerCallback, threshold, target])

    return { setTarget }
}

export default useIntersectionObserver