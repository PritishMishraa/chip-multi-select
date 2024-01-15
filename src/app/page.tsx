"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
  {
    value: "express.js",
    label: "Express.js",
  },
  {
    value: "nest.js",
    label: "Nest.js",
  },
] as Framework[];

export default function ChipMultiSelect() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>([FRAMEWORKS[4]]);
  const [inputValue, setInputValue] = React.useState("");
  const [highlightedBadgeIndex, setHighlightedBadgeIndex] = React.useState(-1);

  const handleUnselect = React.useCallback((framework: Framework) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Backspace" && input.value === "") {
          e.preventDefault();
          const lastSelectedIndex = selected.length - 1;
          if (lastSelectedIndex >= 0) {
            if (highlightedBadgeIndex === -1) {
              setHighlightedBadgeIndex(lastSelectedIndex);
            } else {
              handleUnselect(selected[highlightedBadgeIndex]);
              setHighlightedBadgeIndex(-1);
            }
          }
        } else if (e.key === "Backspace") {
          if (input.value === "") {
            e.preventDefault();
            const lastSelected = selected[selected.length - 1];
            if (lastSelected) {
              handleUnselect(lastSelected);
            }
          }
        } else if (e.key === "Escape") {
          if(highlightedBadgeIndex !== -1) {
            setHighlightedBadgeIndex(-1);
          } else {
            input.blur();
          }
        }
      }
    },
    [handleUnselect, highlightedBadgeIndex, selected]
  );

  const selectables = FRAMEWORKS.filter(
    (framework) => !selected.includes(framework)
  );

  return (
    <div className="bg-primary-foreground my-8 border rounded-md border-border flex flex-col w-full p-8 sm:p-16 md:p-24 items-center">
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex gap-1 flex-wrap">
            {selected.map((framework, index) => {
              return (
                <Badge
                  className={cn(
                    "outline-none",
                    highlightedBadgeIndex === index &&
                      "ring-2 ring-ring ring-offset-2"
                  )}
                  key={framework.value}
                  variant="secondary"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                >
                  {framework.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(framework);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(framework)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select frameworks..."
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, framework]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
}
