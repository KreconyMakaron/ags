{
  description = "AGS Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    flake-utils.url = "github:numtide/flake-utils";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, ags, flake-utils, ... }: 
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
        ];
      in {
        packages. default = ags.lib.bundle {
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
