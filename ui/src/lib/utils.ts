import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toQueryString(params: object): string {
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined)
    .map(key => `${ encodeURIComponent(key) }=${ encodeURIComponent(params[key] as string | number) }`)
    .join('&');
  return queryString ? `?${ queryString }` : '';
}