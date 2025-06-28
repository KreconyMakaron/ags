import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import ControlCenter from "./controlcenter"
import Tray from "gi://AstalTray"
import Hyprland from "gi://AstalHyprland"
import DynamicIcon from "../lib/utils.tsx"

function SysTray() {
  const tray = Tray.get_default()

  return <box 
    className={bind(tray, "items").as(items => (items.length == 0 ? "hidden" : "") + " SysTray Island")}>
    {bind(tray, "items").as(items => items.map(item => (
      <menubutton
        className="bottom-button"
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

  return <box className="Workspaces Island">
    {bind(hypr, "workspaces").as(wss => wss
      .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
      .sort((a, b) => a.id - b.id)
      .map(ws => (
        <button
          className={bind(hypr, "focusedWorkspace").as(fw =>
            ws === fw ? "focused" : "")}
          onClicked={() => ws.focus()}>
        </button>
      ))
    )}
  </box>
}

function Time({ format = "%a %d | %H:%M" }) {
  const time = Variable<string>("").poll(1000, () => GLib.DateTime.new_now_local().format(format)!)

  return <label
    className="Time Island"
    onDestroy={() => time.drop()}
    label={time()} />
}

function SysBox({ visible }: { visible: Variable<boolean> }) {
  const dynamicIcon = DynamicIcon.get_default()

  return <button 
    className="SysBox circle-button Island"
    onClicked={() => visible.set(!visible.get())}>
    <centerbox>
      <icon 
        halign={Gtk.Align.START}
        icon="wifi-symbolic"
      />
      <icon 
        halign={Gtk.Align.CENTER}
        icon={bind(dynamicIcon, "volume")}
      />
      <icon 
        halign={Gtk.Align.END}
        icon={bind(dynamicIcon, "battery")}
      />
    </centerbox>
  </button>
}

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const visible = Variable(false)
  App.add_window(ControlCenter(monitor, visible))

  return <window
    className="Bar"
    gdkmonitor={monitor}
    margin={0}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    layer={Astal.Layer.TOP}
    anchor={TOP | LEFT | RIGHT}>
    <centerbox>
      <box halign={Gtk.Align.START} className="LeftBox">
        <Workspaces/>
        <box hexpand halign={Gtk.Align.CENTER}></box>
        <SysTray/>
      </box>
      <box halign={Gtk.Align.CENTER}>
        <Time />
      </box>
      <box halign={Gtk.Align.END}>
        <SysBox visible={visible}/>
      </box>
    </centerbox>
  </window>
}
