#!/bin/bash
# clean.sh - Reset project to a clean state with only a minimal App.tsx
# Removes: src/components/, src/HOC/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$PROJECT_DIR/src"

echo "🧹 Cleaning project..."
echo ""

# --- Remove directories ---
DIRS_TO_REMOVE=("components" "HOC" "assets")

for dir in "${DIRS_TO_REMOVE[@]}"; do
  if [ -d "$SRC_DIR/$dir" ]; then
    rm -rf "$SRC_DIR/$dir"
    echo "  ✅ Removed src/$dir/"
  else
    echo "  ⏭️  src/$dir/ not found, skipping"
  fi
done
 
# --- index.css ---
cat > "$SRC_DIR/index.css" << 'EOF'

EOF
echo "  ✅ Reset src/index.css to minimal template"

# --- Reset App.tsx to minimal template ---
cat > "$SRC_DIR/App.tsx" << 'EOF'
import style from './App.module.css';

const App = () => {
  return (
    <div className={style.container}>
      <h1>Webpack Clean Template</h1>
    </div>
  );
};

export default App;
EOF
echo "  ✅ Reset src/App.tsx to minimal template"

# --- Reset App.module.css ---
cat > "$SRC_DIR/App.module.css" << 'EOF'
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-size: 24px;
  text-align: center;
}
EOF
echo "  ✅ Reset src/App.module.css to minimal template"

echo ""
echo "✨ Project cleaned successfully!"
echo ""
echo "You can now run:"
echo "  npm start    - to start the dev server"
echo "  npm run build - to create a production build"
