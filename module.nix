{
  lib,
  pkgs,
  config,
  self,
  ...
}:
with lib; let
  cfg = config.services.ags;
in {
  options.services.ags = {
    enable = mkEnableOption "whether to enable a custom ags shell";
    autostart = mkOption {
      type = types.bool;
      default = true;
    };
  };

  config = mkIf cfg.enable {
    home.packages = [
      self.packages.${pkgs.system}.default
    ];

    systemd.user.services.ags = {
      Unit = {
        Description = "AGS Shell";
        Documentation = "https://github.com/KreconyMakaron/ags";
        PartOf = ["graphical-session.target"];
        After = ["graphical-session-pre.target"];
      };

      Service = {
        Type = "simple";
        ExecStart = "${self.packages.${pkgs.system}.default}/bin/ags";
        Restart = "on-failure";
      };
    };
  };
}
