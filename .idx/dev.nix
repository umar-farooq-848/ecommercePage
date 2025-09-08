# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--prefix" "client" ];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install-client = "npm install --prefix client";
        npm-install-server = "npm install --prefix server";
      };
      # Runs when the workspace is (re)started
      onStart = {
        start-server = "npm run dev --prefix server";
      };
    };
  };
}
