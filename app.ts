import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar"
import ControlCenter from  "./widget/controlcenter"

App.start({
  icons: './icons',
  css: style,
  main: () => {
    App.get_monitors().map(Bar)
  }
})
