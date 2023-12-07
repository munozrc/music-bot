import type { SongWithoutUUID } from "../types"
import { config } from "../config"

interface Params {
  id: string
}

const API_URL = "https://www.googleapis.com/youtube/v3/videos"

function fromApiResponseToVideo (response: any): SongWithoutUUID[] {
  return response.map((song: any) => {
    const { id, snippet } = song
    const { title, channelTitle, thumbnails } = snippet
    const { medium } = thumbnails

    const source = `https://music.youtube.com/watch?v=${id}`
    const artist = channelTitle.replace(/ - Topic/gi, "")
    const thumbnail = medium.url ?? medium.default

    return { title, artist, thumbnail, source }
  })
}

export async function getSingleVideo ({ id }: Params): Promise<SongWithoutUUID | undefined> {
  return await globalThis.fetch(`${API_URL}?part=id%2C+snippet&id=${id}&key=${config.YT_API_KEY}`)
    .then(async (res) => await res.json())
    .then((res) => res.items)
    .then(fromApiResponseToVideo)
    .then((songs) => songs.at(0))
    .catch(() => undefined)
}
