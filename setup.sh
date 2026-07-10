#!/bin/bash

echo "📦 Business Finder Kurulumu Başlıyor..."

# Backend bağımlılıklarını yükle
echo "📥 Backend bağımlılıkları yükleniyor..."
npm install

# Frontend bağımlılıklarını yükle
echo "📥 Frontend bağımlılıkları yükleniyor..."
cd frontend
npm install
cd ..

echo "✅ Kurulum tamamlandı!"
echo ""
echo "🚀 Başlamak için:"
echo "   npm run dev          # Backend + Frontend dev mode"
echo "   npm start            # Production mode"
echo ""
echo "🌐 Açılacak adres: http://localhost:5000"
