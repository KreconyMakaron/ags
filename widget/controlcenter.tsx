import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { bind } from "astal"
import Wp from "gi://AstalWp"
import Brightness from "./brightness"
import Variable from "astal/variable"

function VolumeSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!

  return <box className="Slider">
    <icon 
      icon={bind(speaker, "VolumeIcon")}
    />
    <slider
      hexpand
      onDragged={({ value }) => speaker.volume = value}
      value={bind(speaker, "volume")}
    />
  </box>
}

function BrightnessSlider() {
  const brightness = Brightness.get_default()

  return <box className="Slider">
    <icon 
      icon="brightness-high-symbolic"
    />
    <slider
      hexpand
      value={bind(brightness, "screen")}
      onDragged={({ value }) => brightness.screen = value}>
    </slider>
  </box>
}

function ButtonBox() {
  return <box className="ButtonBox">
    <box>
      <button className="circle-button">
        <icon icon="power-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button">
        <icon icon="reboot-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button">
        <icon icon="lock-symbolic"/>
      </button>
    </box>
    <box>
      <button className="circle-button">
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
