{
  lib,
  pkgs,
  config,
  self,
  ...
}:
with lib; let
  cfg = config.services.ags;
  shellBin = "${self.packages.${pkgs.system}.default}/bin/ags";
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

    wayland.windowManager.hyprland.settings = let
      hcfg = cfg.hyprlandIntegration;
    in
      mkIf hcfg.enable {
        exec-once = mkIf hcfg.autostart.enable [
          "systemctl --user restart ${unitName}.service"
        ];
        bind = mkIf cfg.hyprlandIntegration.keybinds.enable [
          "${cfg.hyprlandIntegration.keybinds.openAppLauncher},exec,${shellBin} toggle launcher"
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
