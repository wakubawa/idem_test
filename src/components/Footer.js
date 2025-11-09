export default function Footer() {
  return (
    <footer className="w-full bg-bgGray">
      <div className="mx-auto bg-footer flex h-20 w-full max-w-[var(--breakpoint-desktop)] min-w-[var(--breakpoint-mobile)] items-center justify-between gap-x-4 px-4 tablet:gap-x-6 tablet:px-5">
        {/* Левая часть */}
        <div className="flex items-center gap-4 tablet:gap-5">
          <div className="px-3 py-1 whitespace-nowrap">Магазин</div>

          {/* Ссылки: на мобильных часть скрываем, расширяем по брейкпоинтам */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 whitespace-nowrap text-[11px] mobile:text-xs">
            <section className="hidden mobile:block">О компании</section>
            <section className="hidden mobile:block">Контакты</section>
            <section className="hidden tablet:block">Вакансии</section>
            <section className="hidden tablet:block">Статьи</section>
            <section className="hidden desktop:block">
              Политика обработки персональных данных
            </section>
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex items-center text-[11px] mobile:text-xs">
          <div className="flex items-center gap-2">
            <img src="/img/social/instagram.png" alt="instagram" className="h-5 w-5 tablet:h-6 tablet:w-6" />
            <img src="/img/social/vkontakte.png" alt="vkontakte" className="h-5 w-5 tablet:h-6 tablet:w-6" />
            <img src="/img/social/facebook.png" alt="facebook" className="h-5 w-5 tablet:h-6 tablet:w-6" />
            <img src="/img/social/ok.png" alt="ok" className="h-5 w-5 tablet:h-6 tablet:w-6" />
          </div>

          <div className="ml-3 flex items-center gap-2 tablet:ml-4">
            <img src="/img/phone.png" alt="phone" className="h-4 w-4" />
            <span className="whitespace-nowrap tablet:text-sm">8 800 777 33 33</span>
          </div>
        </div>
      </div>
    </footer>
  );
}