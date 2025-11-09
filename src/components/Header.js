export default function Header() {
  return (
    <>
      <header className="w-full bg-bgGray">
        <div className="mx-auto bg-white flex w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) items-center justify-between gap-6 px-4 py-2 mobile:gap-8 tablet:gap-10">
          {/* Левая часть */}
          <div className="flex flex-1 items-center gap-3 tablet:gap-4">
            <div className="px-3 py-1 text-sm tablet:text-base">Магазин</div>

            <a
              href="#"
              className="rounded-[4px] bg-green px-3 py-1 text-white hover:bg-orange1"
            >
              <span className="flex items-center gap-2">
                <img
                  src="/img/menu.png"
                  alt="Меню"
                  className="h-4 w-4 tablet:h-5 tablet:w-5"
                />
                <span className="text-sm tablet:text-base">Каталог</span>
              </span>
            </a>
          </div>

          {/* Правая часть */}
          <div className="flex flex-1 items-center justify-end">
            <ul className="flex items-center gap-x-3 tablet:gap-x-4">
              <li className="flex flex-col items-center gap-2 px-3 py-1">
                <img
                  src="/img/favorits.png"
                  alt="Избранное"
                  className="h-5 w-5 tablet:h-6 tablet:w-6 desktop:h-7 desktop:w-7"
                />
                <span className="text-[11px] tablet:text-sm">Избранное</span>
              </li>

              <li className="flex flex-col items-center gap-2 px-3 py-1">
                <img
                  src="/img/orders.png"
                  alt="Заказы"
                  className="h-5 w-5 tablet:h-6 tablet:w-6 desktop:h-7 desktop:w-7"
                />
                <span className="text-[11px] tablet:text-sm">Заказы</span>
              </li>

              <li className="flex flex-col items-center gap-2 px-3 py-1">
                <img
                  src="/img/basket.png"
                  alt="Корзина"
                  className="h-5 w-5 tablet:h-6 tablet:w-6 desktop:h-7 desktop:w-7"
                />
                <span className="text-[11px] tablet:text-sm">Корзина</span>
              </li>

              <li className="flex items-center gap-2 px-3 py-1">
                <img
                  src="/img/avatar.png"
                  alt="аватар"
                  className="h-8 w-8 tablet:h-10 tablet:w-10"
                />
                <span className="hidden mobile:inline text-sm tablet:text-base">
                  Алексей
                </span>
                <img
                  src="/img/sp.png"
                  alt="стрелка"
                  className="h-3 w-3 tablet:h-4 tablet:w-4"
                />
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Разделитель-градиент */}
      <div className="mx-auto h-px w-full max-w-(--breakpoint-desktop) min-w-(--breakpoint-mobile) bg-linear-to-b from-gray-100 to-white tablet:h-2" />
    </>
  );
}