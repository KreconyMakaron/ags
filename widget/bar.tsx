import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import ControlCenter from "./controlcenter"
import Tray from "gi://AstalTray"
import Hyprland from "gi://AstalHyprland"

const visible : Variable<boolean> = Variable(false)

function SysTray() {
  const tray = Tray.get_default()

  return <box className="SysTray">
    {bind(tray, "items").as(items => items.map(item => (
      <menubutton
        tooltipMarkup={bind(item, "tooltipMarkup")}
        usePopover={false}
        actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={bind(item, "menuModel")}>
        <icon gicon={bind(item, "gicon")} />
      </menubutton>
    )))}
  </box>
}

function Workspaces() {
  const hypr = Hyprland.get_default()

  return <box className="Workspaces">
    {bind(hypr, "workspaces").as(wss => wss
      .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
      .sort((a, b) => a.id - b.id)
      .map(ws => (
        <button
          onClicked={() => ws.focus()}>
          <icon icon={bind(hypr, "focusedWorkspace").as(fw =>
            ws === fw ? "circle-full" : "circle-empty")} />
        </button>
      ))
    )}
  </box>
}

function Time({ format = "%b %d %H:%M" }) {
  const time = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format(format)!)

  return <label
    className="Time"
    onDestroy={() => time.drop()}
    label={time()} />
}


function SysBox() {
  return <button 
    className="SysBox"
    onClicked={() => visible.set(!visible.get())}>
    <centerbox>
      <icon 
        halign={Gtk.Align.START}
        icon="wifi"
      />
      <icon 
        halign={Gtk.Align.CENTER}
        icon="volume-2"
      />
      <icon 
        halign={Gtk.Align.END}
        icon="power"
      />
    </centerbox>
  </button>
}

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  App.add_window(ControlCenter(monitor, visible))

  return <window
    className="Bar"
    gdkmonitor={monitor}
    margin={0}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.TOP}
    anchor={TOP | LEFT | RIGHT}>
    <centerbox>
      <centerbox hexpand halign={Gtk.Align.START} className="LeftBox">
        <Workspaces hexpand halign={Gtk.Align.START} />
        <SysTray  hexpand halign={Gtk.Align.END}/>
      </centerbox>
      <box hexpand halign={Gtk.Align.CENTER}>
        <Time />
      </box>
      <box hexpand halign={Gtk.Align.END}>
        <SysBox/>
      </box>
    </centerbox>
  </window>
}
