{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    dependencies = [
      ags.packages.${system}.tray
      ags.packages.${system}.hyprland
      ags.packages.${system}.network
      ags.packages.${system}.battery
      ags.packages.${system}.wireplumber
      ags.packages.${system}.apps
    ];
  in {
    packages.${system} = {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "kreshell";
        entry = "app.ts";

        # additional libraries and executables to add to gjs' runtime
        extraPackages = dependencies;
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override {
            extraPackages = dependencies;
          })
        ];
      };
    };
  };
}
