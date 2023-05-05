{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [ 
    netlify-cli
    git-lfs
    yarn
    nodePackages.live-server
  ];

  shellHook = ''
     yarn install
  '';
}
