import Wp, { AstalWpEndpoint } from "gi://AstalWp"
import { Variable, bind } from "astal"
import Brightness from "./brightness"
import Battery, { AstalBatteryDevice } from "gi://AstalBattery"
import GObject, { register, property } from "astal/gobject"

function getVolumeIcon(speakerObj: AstalWpEndpoint) {
  if(speakerObj.mute == true) return "volume-x-symbolic"
  if(speakerObj.volume < .3) return "volume-0-symbolic"
  if(speakerObj.volume < .6) return "volume-1-symbolic"
  else return "volume-2-symbolic"
}

function getBrightessIcon(brightObj: Brightness) {
  if(brightObj.screen < .3) return "brightness-low-symbolic"
  if(brightObj.screen < .6) return "brightness-half-symbolic"
  else return "brightness-high-symbolic"
}

function getBatteryIcon(batteryObj: AstalBatteryDevice) {
  if(batteryObj.charging == true) {
    if(batteryObj.percentage >= .99) return "battery-full-symbolic"
    return "battery-charging-symbolic"
  }
  if(batteryObj.percentage >= .875) return "battery-full-symbolic"
  if(batteryObj.percentage >= .625) return "battery-75-symbolic"
  if(batteryObj.percentage >= .375) return "battery-50-symbolic"
  if(batteryObj.percentage >= .125) return "battery-25-symbolic"
  return "battery-0-symbolic"
}

@register({ GTypeName: "DynamicIcon" })
export default class DynamicIcon extends GObject.Object {
  static instance: DynamicIcon
  static get_default() {
    if (!this.instance) this.instance = new DynamicIcon()
    return this.instance
  }

  #speakerObj = Wp.get_default()!.get_default_speaker()
  #brightObj = Brightness.get_default()
  #batteryObj = Battery.get_default()

  #volume = getVolumeIcon(this.#speakerObj)
  #brightness = getBrightessIcon(this.#brightObj)
  #battery = getBatteryIcon(this.#batteryObj)
  #recent = this.#volume
  #popup = this.#volume

  @property(String)
  get volume() { return this.#volume }

  @property(String)
  get brightness() { return this.#brightness }

  @property(String)
  get battery() { return this.#battery }

  @property(String)
  get recent() { return this.#recent }

  @property(String)
  get popup() { return this.#popup }

  constructor() {
    super()
    this.#speakerObj.connect("notify::volume", () => {
      this.#volume = getVolumeIcon(this.#speakerObj)
      this.#recent = this.#volume
      this.notify("volume")
      this.notify("recent")
    })

    this.#speakerObj.connect("notify::mute", () => {
      this.#volume = getVolumeIcon(this.#speakerObj)
      this.#recent = this.#volume
      this.#popup = this.#volume
      this.notify("volume")
      this.notify("recent")
      this.notify("popup")
    })

    this.#brightObj.connect("notify::screen", () => {
      this.#brightness = getBrightessIcon(this.#brightObj)
      this.#recent = this.#brightness
      this.notify("brightness")
      this.notify("recent")
    })

    this.#brightObj.connect("notify::kbd", () => {
      this.#popup = "power-symbolic"
      this.notify("popup")
    })

    this.#batteryObj.connect("notify::percenteage", () => {
      this.#battery = getBatteryIcon(this.#batteryObj)
    })
  }
}
