jQuery(() => {
    let incognitoActive = localStorage.getItem('st_incognito_active') === 'true';
    let incognitoAffectChat = localStorage.getItem('st_incognito_chat') === 'true';

    // 1. Добавляем настройки в меню Extensions
    const settingsHTML = `
        <div class="incognito-extension-settings">
            <div class="inline-drawer">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>Incognito Cards</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <label class="checkbox_label" for="st-incognito-master-checkbox" style="margin-top:8px;">
                        <input id="st-incognito-master-checkbox" type="checkbox" />
                        <span>Заблюрить аватарки и скрыть имена в меню персонажей</span>
                    </label>
                    <label class="checkbox_label" for="st-incognito-chat-checkbox" style="margin-top:6px; margin-bottom:6px;">
                        <input id="st-incognito-chat-checkbox" type="checkbox" />
                        <span>Также размывать аватарки и скрывать имена в самом чате</span>
                    </label>
                </div>
            </div>
        </div>
    `;

    $('#extensions_settings').append(settingsHTML);

    function applyIncognitoState() {
        $('body').toggleClass('st-incognito-active', incognitoActive);
        $('body').toggleClass('st-incognito-chat', incognitoAffectChat);

        $('#st-incognito-master-checkbox').prop('checked', incognitoActive);
        $('#st-incognito-chat-checkbox').prop('checked', incognitoAffectChat);

        const btn = $('#st-incognito-btn');
        if (btn.length) {
            btn.toggleClass('active-incognito', incognitoActive);
            const iconEl = btn.find('i').length ? btn.find('i').first() : btn;
            iconEl.removeClass('fa-eye fa-eye-slash').addClass(incognitoActive ? 'fa-eye-slash' : 'fa-eye');
            btn.attr('title', incognitoActive
                ? 'Режим Инкогнито ВКЛЮЧЁН (Нажми, чтобы вернуть картинки и имена)'
                : 'Режим Инкогнито (Заблюрить карты в хлам и скрыть имена)'
            );
        }
    }

    // 2. Универсальный поиск ряда иконок (работает и на ПК, и на мобилках!)
    function injectIncognitoButton() {
        if ($('#st-incognito-btn').length > 0) return;

        const panel = $('#right-nav-panel, #rm_characters_block');
        if (!panel.length) return;

        // Ищем любую из стандартных иконок этого ряда
        const firstAnchor = panel.find('.fa-folder-plus, .fa-star, .fa-tags, .fa-tag').first();
        const lastAnchor = panel.find('[class*="fa-filter"], .fa-tags, .fa-tag, .fa-cog, .fa-gear').last();
        if (!firstAnchor.length || !lastAnchor.length) return;

        // Находим общий ряд-контейнер
        let rowContainer = firstAnchor.parents().filter((_, el) => $.contains(el, lastAnchor[0])).first();
        if (!rowContainer.length) {
            rowContainer = firstAnchor.parent();
        }

        const sampleSlot = rowContainer.children().filter((_, el) => el === firstAnchor[0] || $.contains(el, firstAnchor[0])).first();
        const endSlot = rowContainer.children().filter((_, el) => el === lastAnchor[0] || $.contains(el, lastAnchor[0])).last();
        if (!sampleSlot.length || !endSlot.length) return;

        const newBtn = sampleSlot.clone(false);
        newBtn.attr('id', 'st-incognito-btn');
        newBtn.removeAttr('data-i18n');
        newBtn.show();

        const replaceWithEye = (el) => {
            const clsList = (el.attr('class') || '').split(/\s+/);
            clsList.forEach(c => {
                if (c.startsWith('fa-') && c !== 'fa-solid' && c !== 'fa-regular') {
                    el.removeClass(c);
                }
            });
            el.addClass('fa-solid fa-eye');
        };

        if (newBtn.find('i').length) {
            replaceWithEye(newBtn.find('i').first());
        } else {
            replaceWithEye(newBtn);
        }

        newBtn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            incognitoActive = !incognitoActive;
            localStorage.setItem('st_incognito_active', incognitoActive);
            applyIncognitoState();
        });

        endSlot.after(newBtn);
        applyIncognitoState();
    }

    setInterval(injectIncognitoButton, 500);
    setTimeout(injectIncognitoButton, 300);

    // 3. Обработчики галочек
    $(document).on('change', '#st-incognito-master-checkbox', function() {
        incognitoActive = $(this).is(':checked');
        localStorage.setItem('st_incognito_active', incognitoActive);
        applyIncognitoState();
    });

    $(document).on('change', '#st-incognito-chat-checkbox', function() {
        incognitoAffectChat = $(this).is(':checked');
        localStorage.setItem('st_incognito_chat', incognitoAffectChat);
        applyIncognitoState();
    });

    applyIncognitoState();
});
