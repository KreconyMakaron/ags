import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import { bind } from "astal"
import Variable from "astal/variable"
import Wp from "gi://AstalWp"
import Brightness from "../lib/brightness"
import DynamicIcon from "../lib/utils"

function OnScreenPopup({ visible }: { visible: Variable<boolean> }) {
  const dynamicIcon = DynamicIcon.get_default();

  const value = Variable(0)
  const grayed = Variable(false)
  grayed.set(dynamicIcon.mute)
  const skipCounter = Variable(0)

  let count = 0
  function show() {
    visible.set(true)
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
        self.hook(dynamicIcon, "notify::value", () => {
          if(dynamicIcon.mute == false && skipCounter.get() < 2) {
            skipCounter.set(skipCounter.get() + 1)
            return
          }
          if(dynamicIcon.mute == true &&skipCounter.get() < 1) {
            skipCounter.set(1000)
            return
          }

          value.set(dynamicIcon.value)
          grayed.set(dynamicIcon.mute)
          show()
        })
      }}
      revealChild={visible()}
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      >
    <box className="progress" orientation={1}>
        <centerbox>
          <icon icon={bind(dynamicIcon, "icon")} />
          <levelbar 
            valign={Gtk.Align.CENTER}
            widthRequest={100} value={value()}
            className={bind(grayed).as((m) => (m ? "grayed " : "") + "continuous horizontal")} />
          <label 
            label={value(v => `${Math.floor(v * 100)}%`)} 
            width-chars={4}
            xalign={1}/>
        </centerbox>
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
