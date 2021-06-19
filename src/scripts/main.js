document.addEventListener('DOMContentLoaded', () => {
    function slider(params) {
        const { wrapper, container, slide, controll: { btnNext, btnPrev } } = params;

        const $wrapper = document.querySelector(wrapper),
            $container = document.querySelector(container),
            $slides = document.querySelectorAll(slide),
            $btnNext = document.querySelector(btnNext),
            $btnPrev = document.querySelector(btnPrev),
            slideSize = parseInt(window.getComputedStyle($wrapper).width),
            slidesCount = $slides.length;

        let position = 0;

        $btnPrev.addEventListener('click', () => {
            position--;
            slideUpdate();
        });
        $btnNext.addEventListener('click', () => {
            position++;
            slideUpdate();
        });

        function slideUpdate() {
            position = (position > (slidesCount - 1)) ? 0 : position;
            position = (position < 0) ? (slidesCount - 1) : position;
            $container.style.left = `-${slideSize * position}px`;
        }
    }

    function bindTabs(tabsSelector, tabsContentSelector) {
        //all active elements have '-active' word
        const $tabs = document.querySelectorAll(tabsSelector),
            $tabsContent = document.querySelectorAll(tabsContentSelector),
            tabsActive = `${tabsSelector.slice(1)}-active`,
            tabsContentActive = `${tabsContentSelector.slice(1)}-active`;

        //Set default
        $tabs[0].classList.add(tabsActive);
        $tabsContent[0].classList.add(tabsContentActive);

        $tabs.forEach((tab, key) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                $tabs.forEach(i => i.classList.remove(tabsActive));
                $tabsContent.forEach(i => i.classList.remove(tabsContentActive));
                if (!e.target.classList.contains(tabsActive)) {
                    tab.classList.add(tabsActive);
                    $tabsContent[key].classList.add(tabsContentActive);
                }
            });
        });
    }

    function catalogItemInfo(tabSelector, classActive) {
        const $catalogItem = document.querySelectorAll(tabSelector);
        $catalogItem.forEach(item => {
            item.classList.remove(classActive);
            item.addEventListener('click', e => {
                e.preventDefault();
                if (e.target.dataset.catalogmore) {
                    item.classList.add(classActive);
                } else if (e.target.dataset.catalogback) {
                    item.classList.remove(classActive);
                }
            });
        });
    }

    function bindModal(modalTrigger, modalDataName) {
        const $trigger = document.querySelectorAll(modalTrigger);

        $trigger.forEach((btn, key) => {
            btn.addEventListener('click', () => {
                if (modalTrigger === '.catalog__btn') {
                    const productName = document.querySelectorAll('.catalog__title')[key].textContent;
                    showModal(`[data-modal=${modalDataName}]`, productName);
                } else
                    showModal(`[data-modal=${modalDataName}]`);
            });
        });
    }

    function showModal(modalSelector, productName = null) {
        const $modal = document.querySelector(modalSelector),
            $modalSubheader = $modal.querySelector('.modal__subheader'),
            $allModal = document.querySelectorAll('.modal');

        $allModal.forEach(i => i.style.display = 'none');

        if (productName) {
            $modalSubheader.textContent = productName;
        }

        $modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        $modal.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('modal') || target.classList.contains('modal__close')) {
                e.preventDefault();
                $modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    function bindForm(formSelector) {
        const form = document.querySelectorAll(formSelector),
            msg = document.createElement('p');

        const statusMsg = {
            loading: 'Отправка...',
            success: 'Успешно отправлено',
            failure: 'Не удалось отправить'
        };

        form.forEach(i => {
            i.addEventListener('submit', e => {
                e.preventDefault();

                let formData = new FormData(e.target);
                let data = JSON.stringify(Object.fromEntries(formData.entries()));

                e.target.append(msg);
                msg.style.textAlign = 'center';
                msg.textContent = statusMsg.loading;

                postData('http://localhost:3030/applications', data)
                    .then(response => {
                        showModal('[data-modal=success]');
                        msg.textContent = statusMsg.success;
                    })
                    .catch(error => {
                        showModal('[data-modal=failure]');
                        msg.textContent = statusMsg.failure;
                    }).finally(() => {
                        e.target.reset();
                        let msgClear = setTimeout(() => {
                            msg.remove();
                            clearInterval(msgClear);
                        }, 5000);
                    });
            });
        });
    }

    const postData = async(url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-type': 'application/json'
            }
        });
        if (!res.ok) {
            throw new Error(`Problem to open: ${url}. With status: ${res.status}`);
        }
        return await res.json();
    };

    const itemsPostLoader = (element, activeClass) => {
        const $el = document.querySelectorAll(element);
        $el.forEach(e => e.style.display = 'hidden');
        document.addEventListener('scroll', () => {
            $el.forEach(el => {
                let topIndent = el.getBoundingClientRect(),
                    windowHeight = document.documentElement.clientHeight;
                if ((topIndent.top - windowHeight) <= 0) {
                    el.classList.add(activeClass);
                }
            });
        });

    };
    itemsPostLoader('.reviews__item', 'reviews__item-active');

    bindForm('.consultation__form');
    bindForm('.modal__form');
    slider({
        wrapper: '.slider__wrapper',
        container: '.slider__container',
        slide: '.slider__slide',
        controll: {
            btnNext: '.slider__next',
            btnPrev: '.slider__prev'
        }
    });
    catalogItemInfo('.catalog__info', 'catalog__info-active');
    bindTabs('.catalog__tab', '.catalog__wrapper');
    bindModal('.header__btn', 'callback');
    bindModal('.promo__btn', 'callback');
    bindModal('.catalog__btn', 'order');
});