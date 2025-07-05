{lib, pkgs, config, self, ...}: 
with lib; let
  cfg = config.programs.ags;

in {
  options.programs.ags = {
    enable = mkEnableOption "A custom AGS desktop shell";
    autostart = mkOption {
      type = types.bool;
      default = true;
    };
  };

  config = mkIf cfg.enable {
    environment.systemPackages = [
      self.packages.${pkgs.system}.default
    ];

    systemd.user.services.ags = mkIf cfg.autostart {
      enable = true;
      after = ["graphical-session.target"];
      wantedBy = ["graphical-session.target"];
      description = "Starts custom AGS shell";
      serviceConfig = {
        Type = "simple";
        ExecStart = "${self.packages.${pkgs.system}.default}/bin/ags";
        Restart = "on-failure";
      };
    };
  };
}
