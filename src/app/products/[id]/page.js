import RelatedProducts from '@/components/RelatedProducts';
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

export default async function ProductPage({ params }) {
  const { id } = await params;
  const productId = parseInt(id);

  // Загружаем данные продукта из API
  const productRes = await fetch(`https://dummyjson.com/products/${productId}`, { cache: 'no-store' });
  
  // Проверяем, что запрос успешен
  if (!productRes.ok) {
    throw new Error('Продукт не найден');
  }
  
  const product = await productRes.json();

  // Загружаем все товары категории
  let categoryProducts = [];
  if (product.category) {
    try {
      const categoryRes = await fetch(`https://dummyjson.com/products/category/${product.category}`, { cache: 'no-store' });
      if (categoryRes.ok) {
        const categoryData = await categoryRes.json();
        categoryProducts = categoryData.products || [];
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров категории:', error);
    }
  }

  // Загружаем товары со скидкой для раздела "Акции"
  let discountedProducts = [];
  try {
    const discountedRes = await fetch('https://dummyjson.com/products?limit=50', { cache: 'no-store' });
    if (discountedRes.ok) {
      const discountedData = await discountedRes.json();
      // Фильтруем товары со скидкой, ИСКЛЮЧАЕМ текущий товар, и берем первые 4
      discountedProducts = (discountedData.products || [])
        .filter(p => p.id !== productId && p.discountPercentage && p.discountPercentage > 0)
        .slice(0, 4);
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров со скидкой:', error);
  }

  // Вычисляем цену со скидкой (цена с картой)
  const discountedPrice = product.discountPercentage 
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  // Вычисляем средний рейтинг из отзывов
  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / product.reviews.length
    : product.rating || 0;

  // Получаем изображения продукта
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.thumbnail 
      ? [product.thumbnail] 
      : [];

  return (
    <div className="font-sans bg-bgGray">
      {/* Шапка карточки */}
      <div className="mx-auto flex w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) flex-col bg-white px-4 py-2">
        <div className="mx-auto flex w-[1208px] flex-col">
          <div className="flex w-[1208px] flex-col justify-start">
            {product.title}
          </div>

          <div className="flex flex-row items-center gap-4 py-2">
            <div>арт {id}</div>

            <div className="flex flex-row items-center gap-2">
              <StarRating value={avgRating} />
              <span>{product.reviews?.length || 0} {product.reviews?.length === 1 ? 'отзыв' : product.reviews?.length < 5 ? 'отзыва' : 'отзывов'}</span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img src="/img/share.png" alt="share" />
              <span>Поделиться</span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img src="/img/favorits.png" alt="favorits" />
              <div>В Избранное</div>
            </div>
          </div>
        </div>
      </div>

      {/* Галерея + правая колонка с ценой */}
      <div className="mx-auto w-full bg-white max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) px-4 py-4">
        <div className="mx-auto flex w-[1208px] justify-between">
          <div className="flex h-[496px] w-[720px] flex-row justify-between">
            {/* Миниатюры изображений */}
            {images.length > 1 && (
              <div className="flex h-[496px] w-[64px] flex-col justify-between gap-2">
                {images.slice(0, 5).map((img, idx) => (
                  <div key={idx} className="rounded-2xs">
                    <img 
                      className="h-auto w-full rounded-2 object-contain shadow-[2px_2px_4px_rgba(0,0,0,0.3)] cursor-pointer hover:opacity-80" 
                      src={img} 
                      alt={`${product.title} ${idx + 1}`} 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Основное изображение */}
            <div className={`h-auto ${images.length > 1 ? 'w-[608px]' : 'w-full'} rounded-2xs`}>
              <img 
                className="rounded-2xs object-cover shadow-[2px_2px_4px_rgba(0,0,0,0.3)] w-full h-full" 
                src={images[0] || product.thumbnail || '/img/img.png'} 
                alt={product.title} 
              />
            </div>
          </div>

          <div className="w-[424px]">
            <div className="mx-auto flex h-[496px] w-[424px] flex-col gap-4">
            {/* Цены */}
            <div className="flex h-[76px] flex-row justify-between">
              {/* Обычная цена - слева */}
              <div className="flex flex-col justify-end">
                <div className="flex flex-row items-center gap-1">
                  <div className="text-2xl font-bold">
                    {product.price}
                  </div>
                  <div className="text-xl">₽</div>
                </div>
                <div className="text-sm text-gray-600">Общая цена</div>
              </div>
              {/* Цена со скидкой (с картой) - справа */}
              <div className="flex flex-col justify-end">
                <div className="flex flex-row items-center gap-1">
                  <div className="text-2xl font-bold">
                    {discountedPrice}
                  </div>
                  <div className="text-xl">₽</div>
                </div>
                <div className="text-sm text-gray-600">С картой Северяночки</div>
              </div>
            </div>

            {/* в корзину */}
            <div className="flex w-[424px] flex-col gap-2">
              <div className="flex h-[60px] w-full items-center justify-center bg-orange1">
                <div>
                  <img className="h-8 w-8" src="/img/shopping-cart.png" alt="cart" />
                </div>
                <div className="w-[352px] flex justify-center items-center text-white">В корзину</div>
              </div>

              <div className="flex w-full items-center justify-center">
                <div>
                  <img className="h-6 w-6" src="/img/smile.png" alt="smile" />
                </div>
                <div className="text-green text-sm">Вы получаете 10 боусов</div>
              </div>

              <div className="flex w-full items-center justify-center">
                <div>
                  <img className="h-6 w-6" src="/img/bell-off.png" alt="bell" />
                </div>
                <div className="text-sm">Уведомление о снижении цены</div>
              </div>
            </div>

            {/* Описание продукта */}
            <div className="flex w-full flex-col gap-1">
              <div className="mb-2">
                <h3 className="text-lg font-bold mb-2">Описание</h3>
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>
              
              {/* Характеристики */}
              <div className="flex h-[26px] flex-row items-center gap-10 bg-gray-100">
                <div className="w-[200px] text-sm">Бренд</div>
                <div className="font-bold">{product.brand || 'Не указан'}</div>
              </div>
              <div className="flex h-[26px] flex-row items-center gap-10">
                <div className="w-[200px] text-sm">Категория</div>
                <div className="font-bold">{product.category || 'Не указана'}</div>
              </div>
              {product.stock && (
                <div className="flex h-[26px] flex-row items-center gap-10 bg-gray-100">
                  <div className="w-[200px] text-sm">В наличии</div>
                  <div className="font-bold">{product.stock} шт.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* С этим товаром покупают */}
      {categoryProducts.length > 0 && (
        <div className="mx-auto flex w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) flex-col gap-6 px-4 py-6">
          <div className="text-[36px] font-bold">С этими продуктами покупают</div>
          <RelatedProducts products={categoryProducts} currentProductId={productId} />
        </div>
      )}

      {/* Отзывы */}
      <div className="mx-auto flex w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) flex-col gap-10 px-4 py-6">
        <div className="text-[36px] font-bold">Отзывы</div>
        <div className="flex flex-row gap-[144px]">
          {/* Звезды */}
          <div className="flex flex-col gap-4">
            {/* Средняя оценка */}
            <div className="flex flex-row items-center justify-between gap-x-4">
              <StarRating value={avgRating} />
              <div className="font-bold">{avgRating.toFixed(1)} из 5</div>
            </div>

            {/* Количество оценок */}
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((n) => {
                // Подсчитываем количество отзывов с данным рейтингом
                const count = product.reviews 
                  ? product.reviews.filter(r => Math.round(r.rating || 0) === n).length
                  : 0;
                
                return (
                  <div key={n} className="mx-auto flex flex-row items-center justify-between gap-4">
                    <div className="flex justify-start">{n}</div>
                    <div className="flex flex-row gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <img key={i} className="h-4" src={`/img/${i < n ? 'Star 1' : 'star'}.png`} alt="star" />
                      ))}
                    </div>
                    <div className="flex justify-end">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* комментарии */}
          <div className="h-auto w-[688px] flex-col">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => {
                // Форматируем дату отзыва
                const reviewDate = review.date 
                  ? new Date(review.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
                
                return (
                  <div key={idx} className="flex flex-col gap-2 mb-6">
                    <div className="flex flex-row items-center gap-2">
                      <img className="h-4 w-4" src="/img/user.png" alt="user" />
                      <span className="font-semibold">{review.reviewerName || 'Анонимный пользователь'}</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <StarRating value={review.rating || 0} />
                      <div className="text-sm text-gray-600">{reviewDate}</div>
                    </div>
                    <div className="mb-8 h-auto w-[688px] text-sm">{review.comment || review.review || 'Без комментария'}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">Пока нет отзывов</div>
            )}
          </div>
        </div>

        {/* Ваша оценка */}
        <div className="px-[312px]">
          <div className="flex h-8 items-center gap-2 font-bold">
            Ваша оценка
            <img src="/img/star.png" alt="" />
            <img src="/img/star.png" alt="" />
            <img src="/img/star.png" alt="" />
            <img src="/img/star.png" alt="" />
            <img src="/img/star.png" alt="" />
          </div>
          <div>
            <textarea className="h-[100px] w-[688px] resize-none rounded border border-gray-300 p-2" placeholder="отзыв" />
          </div>
          <div className="mb-2 flex h-[40px] w-[188px] items-center justify-center rounded bg-orange2 p-1 text-orange1 hover: ">Отправить отзыв</div>
        </div>
      </div>

      {/* Акции */}
      {console.log('Discounted products:', discountedProducts)}
      {discountedProducts.length > 0 && (
        <div className="mx-auto flex w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) flex-col gap-6 px-4 py-6">
          <div className="text-[36px] font-bold">Акции</div>
          <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-10">
            {discountedProducts.map((discountedProduct) => {
              const discountedPrice = discountedProduct.discountPercentage 
                ? Math.round(discountedProduct.price * (1 - discountedProduct.discountPercentage / 100))
                : discountedProduct.price;

              return (
                <div key={discountedProduct.id} className="w-68 shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
                  <Link href={`/products/${discountedProduct.id}`}>
                    <div className="flex items-center">
                      <img 
                        src={discountedProduct.thumbnail || discountedProduct.images?.[0] || '/img/eat.png'} 
                        alt={discountedProduct.title}
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
                          <div className="text-[16px]">{discountedProduct.price} ₽</div>
                          <div className="text-[12px] text-gray-500">обычная</div>
                        </div>
                      </div>
                      <div className="mx-3 h-10 text-[16px] leading-tight line-clamp-2">{discountedProduct.title}</div>
                      <div className="mx-3 flex h-6 items-center">
                        <StarRating value={discountedProduct.rating || 0} />
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
      )}
    </div>
    </div>
  );
}
