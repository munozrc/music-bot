import type { Song, SongWithoutUUID } from "../types"

export let queue: Song[] = []

export function initQueueManager (): void {
  queue = []
}

export function addSong (data: SongWithoutUUID): Song {
  const uuid = globalThis.crypto.randomUUID()
  queue.unshift({ ...data, uuid })
  return { ...data, uuid }
}

export function getNumberOfSongs (): number {
  return queue.length
}

export function getCurrentSong (): Song | undefined {
  return queue.at(-1)
}

export function getNextSong (): Song | undefined {
  queue.pop()
  return queue.at(-1)
}
