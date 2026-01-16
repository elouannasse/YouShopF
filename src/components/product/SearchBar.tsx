"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * SearchBar component with debounce and clear button
 * Debounces input for 300ms before triggering search
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  defaultValue = "",
  placeholder = "Rechercher des produits...",
  debounceMs = 300,
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [searchQuery, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      {/* Input */}
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-20"
      />

      {/* Loading Indicator */}
      {isSearching && searchQuery && (
        <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}

      {/* Clear Button */}
      {searchQuery && !isSearching && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Effacer</span>
        </Button>
      )}
    </div>
  );
};
