'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Компонент StarRating для отображения рейтинга
function StarRating({ value }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <img 
          key={i} 
          className="h-4 w-4" 
          src={i < filled ? "/img/Star 1.png" : "/img/star.png"} 
          alt={i < filled ? "filled star" : "empty star"} 
        />
      ))}
    </div>
  );
}

// Компонент для товаров из категории с прокруткой
export default function RelatedProducts({ products, currentProductId }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Фильтруем товары, исключая текущий
  const relatedProducts = products.filter(p => p.id !== currentProductId);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [relatedProducts]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Ширина прокрутки
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Контейнер с адаптивным ограничением видимой области */}
      <div className="relative overflow-hidden flex flex-justify-center">
        <div 
          ref={scrollContainerRef}
          className="flex flex-row gap-10 overflow-x-auto scrollbar-hide related-products-container"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {relatedProducts.map((product) => {
            const discountedPrice = product.discountPercentage 
              ? Math.round(product.price * (1 - product.discountPercentage / 100))
              : product.price;

            return (
              <div key={product.id} className="shrink-0 w-68 " style={{ minWidth: '272px' }}>
                <Link href={`/products/${product.id}`}>
                  <div className="flex items-center ">
                    <img 
                      src={product.thumbnail || product.images?.[0] || '/img/eat.png'} 
                      alt={product.title}
                      className="w-full h-auto object-contain aspect-retromax"
                    />
                  </div>
                  <div>
                    <div className="mx-3 h-10 flex justify-between">
                      <div className="flex flex-col">
                        <div className="text-[16px] font-bold">{discountedPrice} ₽</div>
                        <div className="text-[12px] text-gray-500">с картой</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-[16px]">{product.price} ₽</div>
                        <div className="text-[12px] text-gray-500">обычная</div>
                      </div>
                    </div>
                    <div className="mx-3 h-10 text-[16px] leading-tight line-clamp-2">{product.title}</div>
                    <div className="mx-3 flex h-6 items-center">
                      <StarRating value={product.rating || 0} />
                    </div>
                    <div className="mx-3 mt-2 mb-3 flex h-8 cursor-pointer items-center justify-center rounded-[8px] border border-green text-green hover:bg-orange1 hover:border-orange1 hover:text-white transition-colors">
                      в корзину
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Стрелки прокрутки */}
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`flex items-center justify-center w-10 h-10 rounded-1 border ${
            canScrollLeft 
              ? 'border-green text-green cursor-pointer' 
              : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-50'
          } transition-colors`}
          aria-label="Прокрутить влево"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`flex items-center justify-center w-10 h-10 rounded-1 border ${
            canScrollRight 
              ? 'border-green text-green cursor-pointer' 
              : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-50'
          } transition-colors`}
          aria-label="Прокрутить вправо"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .related-products-container {
          /* Mobile: показываем 2 карточки (2 * 272px + gap) */
          max-width: calc(2 * 272px + 2.5rem);
        }
        @media (min-width: 768px) {
          /* Tablet: показываем 3 карточки (3 * 272px + 2 * gap) */
          .related-products-container {
            max-width: calc(3 * 272px + 2 * 2.5rem);
          }
        }
        @media (min-width: 1024px) {
          /* Desktop: показываем 4 карточки (4 * 272px + 3 * gap) */
          .related-products-container {
            max-width: calc(4 * 272px + 3 * 2.5rem);
          }
        }
      `}</style>
    </div>
  );
}

