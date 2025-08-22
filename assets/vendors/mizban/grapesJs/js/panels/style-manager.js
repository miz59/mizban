export function createCSSClassDropdown(input, cssClasses) {
    // حذف dropdown قبلی اگر وجود دارد
    const existingDropdown = document.getElementById('cssClassDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    // ایجاد container برای dropdown
    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'cssClassDropdown';
    dropdownContainer.style.cssText = `
        position: absolute;
        max-height: 200px;
        overflow-y: auto;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        display: none;
        width: 200px;
    `;

    // اضافه کردن dropdown به DOM
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(dropdownContainer);

    // تنظیم event listeners
    let isDropdownVisible = false;

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const filteredClasses = cssClasses.filter(className => 
            className.toLowerCase().includes(value)
        );

        if (filteredClasses.length > 0 && value.length > 0) {
            showDropdown(filteredClasses);
        } else {
            hideDropdown();
        }
    });

    input.addEventListener('focus', function() {
        if (this.value.length > 0) {
            const value = this.value.toLowerCase();
            const filteredClasses = cssClasses.filter(className => 
                className.toLowerCase().includes(value)
            );
            if (filteredClasses.length > 0) {
                showDropdown(filteredClasses);
            }
        }
    });

    input.addEventListener('blur', function() {
        // تاخیر برای اجازه دادن به کلیک روی dropdown
        setTimeout(() => {
            if (!dropdownContainer.matches(':hover')) {
                hideDropdown();
            }
        }, 150);
    });

    function showDropdown(classes) {
        dropdownContainer.innerHTML = '';
        dropdownContainer.style.display = 'block';
        isDropdownVisible = true;

        classes.forEach(className => {
            const item = document.createElement('div');
            item.textContent = className;
            item.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                font-size: 14px;
            `;

            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
            });

            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white';
            });

            item.addEventListener('click', function() {
                input.value = className;
                hideDropdown();
                input.focus();
            });

            dropdownContainer.appendChild(item);
        });

        // تنظیم موقعیت dropdown
        const rect = input.getBoundingClientRect();
        dropdownContainer.style.top = `${rect.bottom + 5}px`;
        dropdownContainer.style.left = `${rect.left}px`;
    }

    function hideDropdown() {
        dropdownContainer.style.display = 'none';
        isDropdownVisible = false;
    }

    // بستن dropdown با کلیک خارج از آن
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdownContainer.contains(e.target)) {
            hideDropdown();
        }
    });
}
