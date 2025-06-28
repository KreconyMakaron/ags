{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
    astal
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    astalpkgs = astal.packages.${system};
  in 
  {
    packages.${system}.default = pkgs.stdenv.mkDerivation rec { 
      pname = "kreshell";
      name = pname;

      src = ./.;

      nativeBuildInputs = with pkgs; [
        wrapGAppsHook
        gobject-introspection
        ags.packages.${system}.default
      ];

      buildInputs = [
        pkgs.glib
        pkgs.gjs
        astalpkgs.io
        astalpkgs.astal4
        astalpkgs.tray
        astalpkgs.hyprland
        astalpkgs.network
        astalpkgs.battery
        astalpkgs.wireplumber
        astalpkgs.apps
      ];

      installPhase = ''
        ags bundle app.ts $out/bin/my-shell
      '';
    };
  };
}
