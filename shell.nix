{ pkgs ? import <nixos> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    yarn
    netlify-cli
    deno
    nodePackages.live-server
    imagemagick
    exiftool
    facedetect
  ];
}
