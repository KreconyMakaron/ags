{
  description = "AGS Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    flake-utils.url = "github:numtide/flake-utils";

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags, flake-utils, ... }: 
    {
      homeManagerModules.default = {config, lib, pkgs, ...}: import ./module.nix {
        inherit lib pkgs config self;
      };
    } // 
    (flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        dependencies = with ags.packages.${system}; [
          tray
          hyprland
          network
          battery
          wireplumber
          apps
          pkgs.bash
          pkgs.brightnessctl
        ];
      in {
        formatter.${system} = nixpkgs.legacyPackages.${system}.alejandra;
        packages.default = ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "ags";
          entry = "app.ts";

          extraPackages = dependencies;
        };

        devShells. default = pkgs.mkShell {
          buildInputs = [
            (ags.packages.${system}.default.override {
              extraPackages = dependencies;
            })
          ];
        };
      }
  ));
}
