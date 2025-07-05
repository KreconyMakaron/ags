# Krecony's Widgets
A set of GTK3 widgets created using Aylur's [AGS](https://aylur.github.io/ags/) and [Astal](https://aylur.github.io/astal/).

![image](https://github.com/user-attachments/assets/2dc44037-db8f-47d3-97f3-42f15c8c1724)

## Features
- bar (Hyprland workspaces, time, status icons)
- control center (volume/brightness sliders)
- on screen display popups for changing volume and brightness

## Instalation
### NixOS
You can test it out with nix run:
```bash
nix run github:KreconyMakaron/ags
```

Or download it fully using flakes:
```nix
# flake.nix
{
  inputs = {
    ags.url = "github:KreconyMakaron/ags";
  };

  outputs = { self, ags, ... }: {
    nixosConfigurations.your-hostname = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ags-flake.nixosModules.default;
        ./configuration.nix
      ];
    };
  };
}

# configuration.nix
{...}: {
  programs.ags = {
    enable = true;
    autostart = true;
  };
}
```

### Other Systems
```bash
git clone git@github.com:KreconyMakaron/ags
ags run ./app.ts --gtk=3
```
