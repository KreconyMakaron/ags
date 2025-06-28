import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { bind } from "astal"
import Wp from "gi://AstalWp"
import Brightness from "../lib/brightness"
import DynamicIcon from "../lib/utils.tsx"
import Variable from "astal/variable"

function VolumeSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!
  const dynamicIcon = DynamicIcon.get_default()

  return <box className={bind(speaker, "mute").as((m) => (m ? "grayed " : "") + "Slider")}>
    <button onClicked={() => {
        dynamicIcon.inhibit()
        speaker.mute = !speaker.mute
      }}>
      <icon 
        icon={bind(dynamicIcon, "volume")}
      />
    </button>
    <slider
      hexpand
      onDragged={({ value }) => {
        dynamicIcon.inhibit()
        speaker.volume = value
      }}
      value={bind(speaker, "volume")}
    />
  </box>
}

function BrightnessSlider() {
  const brightness = Brightness.get_default()
  const dynamicIcon = DynamicIcon.get_default()

  return <box className="Slider">
    <icon 
      icon={bind(dynamicIcon, "brightness")}
    />
    <slider
      hexpand
      value={bind(brightness, "screen")}
      onDragged={({ value }) => {
        dynamicIcon.inhibit()
        brightness.screen = value}
      }>
    </slider>
  </box>
}

function ButtonBox() {
  return <box className="ButtonBox">
    <box>
      <button className="circle-button circle-button-hover">
        <icon icon="power-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button circle-button-hover">
        <icon icon="reboot-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button circle-button-hover">
        <icon icon="lock-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button circle-button-hover">
        <icon icon="sleep-symbolic"/>
      </button>
    </box>
  </box>
}

export default function ControlCenter(monitor: Gdk.Monitor, visible: Variable<boolean>) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    name="ControlCenter"
    className="ControlCenter"
    anchor={TOP | RIGHT}
    gdkmonitor={monitor}
    exclusivity={Astal.Exclusivity.NONE}
    margin={10 | 0 | 0 | 0}
    layer={Astal.Layer.OVERLAY}>
    <revealer
      revealChild={visible()}>
      <box
          orientation={1}>
          <box
            orientation={1}
            vexpand
            valign={Gtk.Align.START}> 
            <VolumeSlider/>
            <BrightnessSlider/>
          </box>
          <ButtonBox valign={Gtk.Align.END}/>
      </box>
    </revealer>
  </window>
}
