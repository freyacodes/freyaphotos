{ pkgs ? import <nixos> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    yarn
    netlify-cli
    deno
    imagemagick
    exiftool
    facedetect
  ];
}
