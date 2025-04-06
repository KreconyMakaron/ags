import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import { bind } from "astal"
import Variable from "astal/variable"
import Wp from "gi://AstalWp"
import Brightness from "../lib/brightness"
import DynamicIcon from "../lib/utils"

function OnScreenPopup({ visible }: { visible: Variable<boolean> }) {
  const brightness = Brightness.get_default()
  const speaker = Wp.get_default()!.get_default_speaker()
  const dynamicIcon = DynamicIcon.get_default();

  const value = Variable(0)
  const grayed = Variable(false)
  const classname = Variable("progress");

  let count = 0
  function show(v: number) {
    visible.set(true)
    value.set(v)
    count++
    timeout(2000, () => {
      count--
      if (count === 0) {
        visible.set(false)
      }
    })
  }

  return (
    <revealer
      setup={(self) => {
        self.hook(brightness, "notify::screen", () => {
          classname.set("progress")
          grayed.set(false);
          show(brightness.screen)
        })

        if (speaker) {
          self.hook(speaker, "notify::volume", () => {
            classname.set("progress")
            if(speaker.mute) grayed.set(true);
            show(speaker.volume)
          })
          self.hook(speaker, "notify::mute", () => {
            classname.set("popup")
            grayed.set(false);
            show(speaker.volume)
          })
        }
      }}
      revealChild={visible()}
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      >
    <box className={classname()} orientation={1}>
        <centerbox>
          <icon icon={bind(dynamicIcon, "recent")} />
          <levelbar 
            valign={Gtk.Align.CENTER}
            widthRequest={100} value={value()}
            className={bind(grayed).as((m) => (m ? "grayed " : "") + "continuous horizontal")} />
          <label 
            label={value(v => `${Math.floor(v * 100)}%`)} 
            width-chars={4}
            xalign={1}/>
        </centerbox>
        <icon icon={bind(dynamicIcon, "popup")} />
    </box>
  </revealer>
  )
}

export default function OSD(monitor: Gdk.Monitor) {
  const visible = Variable(false)

  return (
    <window
      gdkmonitor={monitor}
      className="OSD"
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={Astal.WindowAnchor.TOP}
      >
      <box>
        <eventbox onClick={() => visible.set(false)}>
          <OnScreenPopup visible={visible} />
        </eventbox>
      </box>
    </window>
  )
}
