import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"

const MAX_ITEMS = 15

function hide() {
  App.get_window("launcher")!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
  return <button
    className="AppButton"
    onClicked={() => { hide(); app.launch() }}>
    <box>
      <icon icon={app.iconName} />
      <box valign={Gtk.Align.CENTER} vertical>
        <label
          className="name"
          truncate
          xalign={0}
          label={app.name}
        />
      </box>
    </box>
  </button>
}

export default function Applauncher() {
  const { CENTER } = Gtk.Align
  const apps = new Apps.Apps()
  const width = Variable(1000)

  const text = Variable("")
  const list = text(text => apps.fuzzy_query(text).slice(0, MAX_ITEMS))
  const onEnter = () => {
    apps.fuzzy_query(text.get())?.[0].launch()
    hide()
  }
  const entry = <entry
    placeholderText="Search..."
    text={text()}
    onChanged={self => text.set(self.text)}
    onActivate={onEnter}
  />

  return <window
    name="launcher"
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
    exclusivity={Astal.Exclusivity.IGNORE}
    keymode={Astal.Keymode.ON_DEMAND}
    application={App}
    onShow={(self) => {
      text.set("")
      width.set(self.get_current_monitor().workarea.width)
      entry.grab_focus()
    }}
    setup={(self) => self.hide()}
    onKeyPressEvent={function (self, event: Gdk.Event) {
      if (event.get_keyval()[1] === Gdk.KEY_Escape)
      self.hide()
    }}>
    <box>
      <eventbox widthRequest={width(w => w / 2)} expand onClick={hide} />
      <box hexpand={false} vertical>
        <eventbox heightRequest={100} onClick={hide} />
          {entry}
          <box widthRequest={500} className="Applauncher" vertical>
          <box spacing={6} vertical>
            {list.as(list => list.map(app => (
                <AppButton app={app} />
            )))}
          </box>
          <box
            halign={CENTER}
            className="not-found"
            vertical
            visible={list.as(l => l.length === 0)}>
            <label label="No match found" />
          </box>
          </box>
        <eventbox expand onClick={hide} />
      </box>
      <eventbox widthRequest={width(w => w / 2)} expand onClick={hide} />
    </box>
  </window>
}
