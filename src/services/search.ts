import { searchMusics } from "node-youtube-music"
import type { SongWithoutUUID } from "../types"

interface Params {
  query: string
}

function parseArtist (artists: any[] | string): string {
  if (typeof artists === "string") return artists
  return artists.map((a) => a.name).join(" & ")
}

function fromApiResponseToSong (response: any): SongWithoutUUID[] {
  return response.map((song: any) => {
    const { title, youtubeId, thumbnailUrl: thumbnail, artists } = song
    const source = `https://music.youtube.com/watch?v=${youtubeId}`
    const artist = parseArtist(artists)
    return { title, artist, thumbnail, source }
  })
}

export async function searchSong ({ query }: Params): Promise<SongWithoutUUID[]> {
  return await searchMusics(query)
    .then(fromApiResponseToSong)
    .then((songs) => songs.slice(0, 5))
    .catch(() => [])
}
