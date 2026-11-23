"use client"

import { useSyncExternalStore } from "react"

import { getState, hydrateStore, subscribe } from "./store"

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState)
}

export function useHydratedStore() {
  if (typeof window !== "undefined") hydrateStore()
  return useStore()
}
