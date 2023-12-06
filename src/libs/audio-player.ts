import { createAudioPlayer, AudioPlayerStatus, createAudioResource, type VoiceConnection, type AudioPlayer, type AudioResource } from "@discordjs/voice"
import ytdl from "ytdl-core"
import { playNextSong } from "./audio-player-controls"

export let audioPlayer: AudioPlayer | undefined
export let audioResource: AudioResource | undefined
export let volume: number = 0.2

export function initAudioPlayer (connection: VoiceConnection): void {
  audioPlayer = createAudioPlayer()
  connection.subscribe(audioPlayer)

  audioPlayer.on("error", (err) => {
    console.error(`[AUDIO_PLAYER_ERROR]: ${err.stack}`)
  })

  audioPlayer.on(AudioPlayerStatus.Idle, (oldState, newState) => {
    if (oldState.status === AudioPlayerStatus.Playing) playNextSong()
    console.log({ old: oldState.status, new: newState.status })
    console.log("[AUDIO_PLAYER] Now is idle")
  })
}

export function initAudioResource (URL: string): AudioResource {
  const stream = ytdl(URL, { filter: "audioonly" })
  audioResource = createAudioResource(stream, { inlineVolume: true })
  audioResource.volume?.setVolume(volume)
  return audioResource
}

export function setAudioPlayerVolume (value: number): boolean {
  const isValidVolume = value >= 0 && value <= 100

  if (isValidVolume) {
    const parseValue = value / 100
    audioResource?.volume?.setVolume(parseValue)
    volume = parseValue
  }

  return isValidVolume
}

export function destroyAudioPlayer (): void {
  if (typeof audioPlayer === "undefined") return
  audioPlayer.stop()
  audioPlayer = undefined
}
