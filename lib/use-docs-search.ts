import { SearchDocsResult } from "@/app/api/search/route";
import { useState, useEffect } from "react";
import useSWR from "swr";

export function useDocsSearch() {
    const [search, setSearch] = useState("");
    const debouncedValue = useDebounce(search, 100);

    const searchQuery = useSWR(
        ["docs", debouncedValue],
        async (key) => {
            if (debouncedValue.length === 0) return "empty";
            const res = await fetch(`/api/search?query=${key[1]}`);

            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as SearchDocsResult;
        },
        {
            keepPreviousData: true,
        }
    );

    return { search, setSearch, query: searchQuery };
}

function useDebounce<T>(value: T, delayMs: number = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delayMs]);

    return debouncedValue;
}
