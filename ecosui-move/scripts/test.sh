#!/bin/bash

echo "🧪 Testing EcoSui Move Modules..."

# Run Move unit tests
sui move test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed!"
    exit 1
fi

echo "📊 Test coverage report:"
sui move coverage summary