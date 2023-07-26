{ pkgs ? import <nixos> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [ 
    netlify-cli
    deno
    nodePackages.live-server
    imagemagick
    exiftool
    facedetect
  ];
}
