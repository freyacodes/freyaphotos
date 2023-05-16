{ pkgs ? import <nixos> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [ 
    netlify-cli
    deno
    git-lfs
    nodePackages.live-server
    imagemagick
    exiftool
  ];
}
