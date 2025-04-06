import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar"
import OSD from "./widget/osd"
import AppLauncher from "./widget/applauncher"
import ControlCenter from  "./widget/controlcenter"

App.start({
  icons: './icons',
  css: style,
  main: () => {
    App.get_monitors().map(Bar)
    App.get_monitors().map(OSD)
    App.get_monitors().map(AppLauncher)
  }
})
