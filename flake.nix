{
  description = "Turtle Path — robot maze puzzle (Vite + React + TS)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        # `nix develop` — plain dev shell, npm manages node_modules as usual.
        devShells.default = pkgs.mkShell {
          packages = [ pkgs.nodejs_20 pkgs.nodePackages.npm ];
        };

        # `nix build` — reproducible static build, output in ./result.
        # npmDepsHash below is a placeholder: run the build once, Nix will
        # print the correct hash in the error message, then paste it in.
        packages.default = pkgs.buildNpmPackage {
          pname = "turtle-path";
          version = "0.1.0";
          src = ./.;

          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

          installPhase = ''
            mkdir -p $out
            cp -r dist/* $out/
          '';
        };
      });
}
