{
  lib,
  pkgs,
  config,
  self,
  astal,
  ...
}:
with lib; let
  cfg = config.services.ags;
  hcfg = cfg.hyprlandIntegration;
  shellBin = "${self.packages.${pkgs.system}.default}/bin/ags";
  astalBin = "${astal.packages.${pkgs.system}.default}/bin/astal";
  unitName = "ags";
in {
  options.services.ags = {
    enable = mkEnableOption "whether to enable a custom ags shell";
    hyprlandIntegration = {
      enable = mkEnableOption "whether to integrate with hyprland";
      autostart.enable = mkEnableOption "whether to autostart the shell using exec-once";
      keybinds = {
        enable = mkEnableOption "whether to set keybinds in hyprland from this module";
        openAppLauncher = mkOption {
          type = types.str;
          default = "SUPER,D";
        };
      };
    };
  };

  config = mkIf cfg.enable {
    home.packages = [
      self.packages.${pkgs.system}.default
    ];

    wayland.windowManager.hyprland.settings = mkIf hcfg.enable {
        exec-once = optionals hcfg.autostart.enable [
          "systemctl --user restart ${unitName}"
        ];
        bind = optionals hcfg.keybinds.enable [
          "${hcfg.keybinds.openAppLauncher},exec,${astalBin} -t launcher"
        ];
      };

    systemd.user.services.${unitName} = {
      Unit = {
        Description = "AGS Shell";
        Documentation = "https://github.com/KreconyMakaron/ags";
        PartOf = ["graphical-session.target"];
        After = ["graphical-session-pre.target"];
      };

      Service = {
        Type = "simple";
        ExecStart = "${shellBin}";
        Restart = "on-failure";
      };
    };
  };
}
