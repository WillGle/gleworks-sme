{
  description = "GitWork Frontend - React + TypeScript + Vite";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
        
        # Node.js version for consistency
        nodejs = pkgs.nodejs_20;
        
      in {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js toolchain
            nodejs
            nodePackages.npm
            
            # TypeScript tooling
            nodePackages.typescript
            nodePackages.typescript-language-server
            
            # Code quality tools
            nodePackages.eslint
            nodePackages.prettier
            
            # Docker for building images
            docker
            docker-compose
            
            # Git
            git
            
            # Utilities
            jq
            curl
          ];
          
          shellHook = ''
          # Fix Docker image timestamps (NixOS reproducibility issue)
          unset SOURCE_DATE_EPOCH
            echo "  GleWork Frontend Development Environment"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "  Node.js:    $(node --version)"
            echo "  npm:        $(npm --version)"
            echo "  TypeScript: $(tsc --version)"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "  Available Commands:"
            echo "  npm run dev         - Start Vite dev server (port 5173)"
            echo "  npm run build       - Build production bundle"
            echo "  npm run preview     - Preview production build"
            echo "  npm run test        - Run tests"
            echo "  npm run lint        - Lint TypeScript/React code"
            echo "  npm run format      - Format code with Prettier"
            echo ""
            
            # Set up npm cache in project directory (optional)
            export NPM_CONFIG_PREFIX="$PWD/.npm-global"
            export PATH="$PWD/.npm-global/bin:$PATH"
            
            # Ensure node_modules/.bin is in PATH
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            # Install dependencies if node_modules doesn't exist
            if [ ! -d "node_modules" ]; then
              echo "Installing dependencies..."
              npm install
            fi
            
            echo "Development environment ready!"
          '';
          
          # Environment variables to skip heavy downloads
          CYPRESS_INSTALL_BINARY = "0";
          PUPPETEER_SKIP_DOWNLOAD = "1";
        };
      }
    );
}
