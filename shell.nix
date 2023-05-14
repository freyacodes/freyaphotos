{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [ 
    netlify-cli
    git-lfs
    nodePackages.live-server
    imagemagick
    exiftool
  ];
}
