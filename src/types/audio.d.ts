export interface Song {
  uuid: string
  title: string
  artist: string
  source: string
  thumbnail: string
}

export interface SongWithoutUUID extends Omit<Song, "uuid"> {}
