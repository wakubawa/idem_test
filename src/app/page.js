'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(16); // Начальное значение после первых 16 товаров
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchCategory, setSearchCategory] = useState(null);

  // Загружаем начальные 16 товаров
  const loadInitialProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/products?limit=16&skip=0');
      const data = await res.json();
      const loadedProducts = data?.products ?? [];
      setProducts(loadedProducts);
      setSkip(16);
      setHasMore(loadedProducts.length === 16 && data.total > 16);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  const loadMoreProducts = async () => {
    setIsLoading(true);
    try {
      // Загружаем еще 8 товаров
      const res = await fetch(`https://dummyjson.com/products?limit=8&skip=${skip}`);
      const data = await res.json();
      const newProducts = data?.products ?? [];
      
      if (newProducts.length > 0) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts, ...newProducts];
          // Проверяем, есть ли еще товары
          const totalLoaded = updatedProducts.length;
          setHasMore(totalLoaded < data.total);
          return updatedProducts;
        });
        setSkip(prevSkip => prevSkip + 8);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      return;
    }

    setIsLoading(true);
    setIsSearchMode(true);
    setSearchQuery(query);

    try {
      // Ищем товары по запросу
      const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const searchResults = data?.products ?? [];

      if (searchResults.length > 0) {
        // Берем категорию первого найденного товара
        const firstProduct = searchResults[0];
        const category = firstProduct.category;

        // Загружаем все товары этой категории
        const categoryRes = await fetch(`https://dummyjson.com/products/category/${category}`);
        const categoryData = await categoryRes.json();
        const categoryProducts = categoryData?.products ?? [];

        setProducts(categoryProducts);
        setSearchCategory(category);
        setHasMore(false); // В режиме поиска не показываем кнопку "Загрузить еще"
      } else {
        // Если ничего не найдено, показываем пустой список
        setProducts([]);
        setSearchCategory(null);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSearchCategory(null);
    loadInitialProducts();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="font-sans">
      {/* Верхний градиент */}
      <div className="mx-auto h-8 w-full max-w-360 min-w-(--breakpoint-mobile) bg-linear-to-b from-gray-100 to-white" />

      {/* Хлебные крошки */}
      <div className="mx-auto flex h-8 w-full max-w-360 min-w-(--breakpoint-mobile) items-center bg-white px-0 tablet:px-5">
        <section 
          className="pl-5"
          onClick={handleResetSearch}
        >
          Главная
        </section>
        {searchCategory && (
          <>
            <section className="flex items-center pl-5">
              <img src="/img/sp.png" className="-rotate-90" alt="->" />
            </section>
            <section className="pl-5 capitalize">{searchCategory.replace(/-/g, ' ')}</section>
          </>
        )}
      </div>

      {/* Основной блок */}
      <main className="mx-auto w-full max-w-360 min-w-(--breakpoint-mobile) bg-white pl-5 pr-5">
        {/* Поиск */}
        <div className="mx-auto flex h-25 flex-col justify-between">
          <section>
            <h1 className="text-xl mobile:text-xl tablet:text-2xl desktop:text-3xl">Поиск</h1>
          </section>

          <section className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Найти товар"
              className="w-full rounded-lg border border-green px-4 py-2 focus:border-green focus:outline-none"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Найти
            </button>
            {isSearchMode && (
              <button
                onClick={handleResetSearch}
                className="px-4 py-2 border border-green rounded-lg hover:bg-gray-100"
              >
                Сбросить
              </button>
            )}
          </section>
        </div>

        {/* Сетка карточек */}
        <div className="mx-auto mt-10 w-full max-w-360 bg-white pl-0 tablet:pl-5">
          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Загрузка...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">
                {isSearchMode ? 'Товары не найдены' : 'Товары не загружены'}
              </div>
            </div>
          ) : (
            <div className="grid w-full gap-5 mobile:grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4">
              {products.map((p) => {
                // Вычисляем цену со скидкой (цена с картой)
                const discountedPrice = p.discountPercentage 
                  ? Math.round(p.price * (1 - p.discountPercentage / 100))
                  : p.price;
                
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    description={p.description}
                    price={p.price}
                    discountedPrice={discountedPrice}
                    discountPercentage={p.discountPercentage}
                    rating={p.rating}
                    image={p.thumbnail || p.images?.[0]}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Кнопка "Загрузить еще" - только если не в режиме поиска */}
        {!isSearchMode && hasMore && products.length > 0 && (
          <div className="mt-10 flex justify-center pb-10">
            <button 
              onClick={loadMoreProducts}
              disabled={isLoading}
              className="cursor-pointer border border-gray-300 p-2 hover:border-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Загрузка...' : 'Загрузить еще'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function StarRating({ value }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1 text-orange1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-sm">
          {i < filled ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ id, title, description, price, discountedPrice, discountPercentage, rating, image }) {
  return (
    <Link href={`/products/${id}`} className="gap-6 shadow-[2px_2px_4px_rgba(0,0,0,0.3)] block hover:opacity-90 transition-opacity">
      {/* Картинка продукта */}
      <div>  
        <img src={image} alt={title} className="h-full w-full object-contain aspect-retromax" />
      </div>

      <div className="flex flex-col">
        {/* Заголовок */}
        <div className="mx-3 mt-2">
          <div className="text-[16px] h-5 line-clamp-2 font-semibold">{title}</div>
        </div>

        {/* Цены под картинкой */}
        <div className="mx-3 mt-2 flex items-center justify-between">
          {/* Цена со скидкой (с картой) - слева */}
          <div className="flex flex-col">
            <div className="text-[16px] font-bold">{discountedPrice} ₽</div>
            <div className="text-[12px] text-gray">с картой</div>
          </div>
          {/* Обычная цена - справа */}
          <div className="flex flex-col items-end">
            <div className="text-[16px]">
              {price} ₽
            </div>
            <div className="text-[12px] text-gray">обычная</div>
          </div>
        </div>

        {/* Описание после цены */}
        <div className="mx-3 mt-2">
          <div className="text-[12px]  text-gray line-clamp-2">{description}</div>
        </div>

        {/* Рейтинг */}
        <div className="mx-3 mt-2">
          <StarRating value={rating} />
        </div>

        {/* Кнопка "В корзину" */}
        <div 
          className="mx-3 mt-2 mb-3 flex h-8 cursor-pointer items-center justify-center rounded-[8px] border border-green text-green hover:bg-orange1 hover:border-orange1 hover:text-white transition-colors"
        >
          В корзину
        </div>
      </div>
    </Link>
  );
}

