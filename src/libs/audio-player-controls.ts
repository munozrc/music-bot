import { audioPlayer, initAudioResource } from "./audio-player"
import { getNextSong } from "./queue-manager"
import type { Song } from "../types"

export function playSong (song: Song): Song | undefined {
  const audioResource = initAudioResource(song.source)
  if (typeof audioPlayer === "undefined") return undefined
  audioPlayer?.play(audioResource)
  return song
}

export function playNextSong (): Song | undefined {
  const currentSong = getNextSong()
  if (typeof currentSong === "undefined") return undefined
  return playSong(currentSong)
}
