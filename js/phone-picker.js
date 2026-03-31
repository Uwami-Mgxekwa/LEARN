// ===================================
// International Phone Country Picker
// Auto-detects user country via IP, allows manual search/select
// Usage: initPhonePicker('inputElementId')
// ===================================

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', dial: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', dial: '+355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'HR', name: 'Croatia', dial: '+385', flag: '🇭🇷' },
  { code: 'CZ', name: 'Czech Republic', dial: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dial: '+45', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { code: 'FI', name: 'Finland', dial: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', dial: '+30', flag: '🇬🇷' },
  { code: 'HK', name: 'Hong Kong', dial: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dial: '+36', flag: '🇭🇺' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dial: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', dial: '+52', flag: '🇲🇽' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'NO', name: 'Norway', dial: '+47', flag: '🇳🇴' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'PE', name: 'Peru', dial: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', dial: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', dial: '+886', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'ZM', name: 'Zambia', dial: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263', flag: '🇿🇼' },
];

// Detect country from IP (free, no API key needed)
async function detectUserCountry() {
    try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        return data.country_code || 'US';
    } catch {
        return 'US';
    }
}

// Inject CSS once
function injectPhonePickerCSS() {
    if (document.getElementById('phone-picker-css')) return;
    const style = document.createElement('style');
    style.id = 'phone-picker-css';
    style.textContent = `
        .phone-picker-wrap { display: flex; gap: 0; width: 100%; }
        .phone-picker-btn {
            display: flex; align-items: center; gap: 0.35rem;
            padding: 0 0.75rem; height: 100%;
            border: 1.5px solid var(--border); border-right: none;
            border-radius: var(--radius-md) 0 0 var(--radius-md);
            background: var(--gray-50); cursor: pointer;
            font-size: 0.9rem; white-space: nowrap;
            transition: border-color 0.15s;
            min-width: 90px; justify-content: space-between;
        }
        .phone-picker-btn:hover { border-color: var(--purple); }
        .phone-picker-btn .pp-flag { font-size: 1.1rem; line-height: 1; }
        .phone-picker-btn .pp-dial { font-size: 0.82rem; color: var(--text-secondary); font-weight: 600; }
        .phone-picker-btn .pp-caret { font-size: 0.6rem; color: var(--text-muted); }
        .phone-picker-input {
            flex: 1; border-radius: 0 var(--radius-md) var(--radius-md) 0 !important;
        }
        .phone-picker-dropdown {
            position: absolute; top: calc(100% + 4px); left: 0;
            width: 280px; max-height: 260px; overflow-y: auto;
            background: var(--white); border: 1.5px solid var(--border);
            border-radius: var(--radius-md); box-shadow: var(--shadow-md);
            z-index: 9999; display: none;
        }
        .phone-picker-dropdown.open { display: block; }
        .pp-search {
            padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border);
            position: sticky; top: 0; background: var(--white);
        }
        .pp-search input {
            width: 100%; border: 1px solid var(--border); border-radius: var(--radius-sm);
            padding: 0.4rem 0.6rem; font-size: 0.85rem; outline: none;
        }
        .pp-search input:focus { border-color: var(--purple); }
        .pp-option {
            display: flex; align-items: center; gap: 0.6rem;
            padding: 0.55rem 0.75rem; cursor: pointer; font-size: 0.85rem;
            transition: background 0.1s;
        }
        .pp-option:hover, .pp-option.selected { background: var(--purple-tint); }
        .pp-option .pp-flag { font-size: 1rem; }
        .pp-option .pp-name { flex: 1; color: var(--text-primary); }
        .pp-option .pp-dial { color: var(--text-muted); font-size: 0.8rem; }
    `;
    document.head.appendChild(style);
}

async function initPhonePicker(inputId, options = {}) {
    injectPhonePickerCSS();

    const originalInput = document.getElementById(inputId);
    if (!originalInput) return;

    // Detect country
    const countryCode = options.countryCode || await detectUserCountry();
    let selected = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES.find(c => c.code === 'US');

    // Build wrapper
    const wrap = document.createElement('div');
    wrap.className = 'phone-picker-wrap';
    wrap.style.position = 'relative';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phone-picker-btn';
    btn.innerHTML = `<span class="pp-flag">${selected.flag}</span><span class="pp-dial">${selected.dial}</span><span class="pp-caret">▼</span>`;

    const dropdown = document.createElement('div');
    dropdown.className = 'phone-picker-dropdown';

    const searchWrap = document.createElement('div');
    searchWrap.className = 'pp-search';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search country...';
    searchWrap.appendChild(searchInput);
    dropdown.appendChild(searchWrap);

    function renderOptions(filter = '') {
        const existing = dropdown.querySelectorAll('.pp-option');
        existing.forEach(el => el.remove());
        const filtered = COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(filter.toLowerCase()) ||
            c.dial.includes(filter)
        );
        filtered.forEach(c => {
            const opt = document.createElement('div');
            opt.className = 'pp-option' + (c.code === selected.code ? ' selected' : '');
            opt.innerHTML = `<span class="pp-flag">${c.flag}</span><span class="pp-name">${c.name}</span><span class="pp-dial">${c.dial}</span>`;
            opt.addEventListener('click', () => {
                selected = c;
                btn.innerHTML = `<span class="pp-flag">${c.flag}</span><span class="pp-dial">${c.dial}</span><span class="pp-caret">▼</span>`;
                dropdown.classList.remove('open');
                phoneInput.focus();
            });
            dropdown.appendChild(opt);
        });
    }

    renderOptions();
    searchInput.addEventListener('input', () => renderOptions(searchInput.value));

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            searchInput.value = '';
            renderOptions();
            setTimeout(() => searchInput.focus(), 50);
        }
    });

    document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target)) dropdown.classList.remove('open');
    });

    // Clone original input and adapt it
    const phoneInput = originalInput.cloneNode(true);
    phoneInput.className = originalInput.className + ' phone-picker-input';
    phoneInput.placeholder = '555 123 4567';
    phoneInput.style.borderRadius = '0 var(--radius-md) var(--radius-md) 0';

    wrap.appendChild(btn);
    wrap.appendChild(dropdown);
    wrap.appendChild(phoneInput);

    originalInput.parentNode.replaceChild(wrap, originalInput);

    // Keep original input in sync (hidden) for form submission
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = inputId;
    hiddenInput.name = originalInput.name || inputId;
    wrap.appendChild(hiddenInput);

    phoneInput.addEventListener('input', () => {
        hiddenInput.value = selected.dial + ' ' + phoneInput.value.trim();
    });

    return { getFullNumber: () => selected.dial + ' ' + phoneInput.value.trim() };
}
