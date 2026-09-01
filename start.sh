#!/usr/bin/env bash
set -e

echo "======================================================================"
echo " Starting BusinessIntelligence.ai — Intelligence-to-Action Platform"
echo "======================================================================"

# Check Python environment
echo "[1/3] Checking Python dependencies..."
python3 -m pip install fastapi uvicorn pydantic pandas numpy scipy scikit-learn --quiet

# Check Frontend build
if [ ! -d "frontend/dist" ]; then
    echo "[2/3] Building Frontend SPA..."
    cd frontend
    npm install --quiet
    npm run build
    cd ..
else
    echo "[2/3] Frontend build found in frontend/dist."
fi

# Run tests
echo "[3/3] Running Analytical Verification Test Suite..."
cd backend
PYTHONPATH=. pytest tests/test_engine.py -q
cd ..

echo "======================================================================"
echo " All systems verified! Launching server on http://localhost:8000"
echo " Open http://localhost:8000 in your browser to access the dashboard."
echo "======================================================================"

cd backend
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000
