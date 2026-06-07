import { filterCSSClasses } from './css-classes.js';

export function createCSSClassDropdown(input, cssClasses) {
    const existingDropdown = document.getElementById('cssClassDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'cssClassDropdown';

    input.parentNode.appendChild(dropdownContainer);

    let isDropdownVisible = false;
    let selectedIndex = -1;

    function highlightItem(index) {
        const items = dropdownContainer.querySelectorAll('div');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add("selected");
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove("selected");
            }
        });
    }

    input.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        selectedIndex = -1;

        let existingClasses = new Set();
        const comp = editor.getSelected();
        if (comp) {
            existingClasses = new Set(comp.getClasses());
        }

        const filteredClasses = filterCSSClasses(cssClasses, value, existingClasses);

        if (filteredClasses.length > 0 && value.length > 0) {
            showDropdown(filteredClasses);
        } else {
            hideDropdown();
        }
    });

    input.addEventListener('keydown', function (e) {
        if (!isDropdownVisible) return;

        const items = dropdownContainer.querySelectorAll('div');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            highlightItem(selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            highlightItem(selectedIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                items[selectedIndex].click();
            }
        }
    });

    input.addEventListener('focus', function () {
        if (this.value.length > 0) {
            const value = this.value.toLowerCase();

            let existingClasses = new Set();
            const comp = editor.getSelected();
            if (comp) {
                existingClasses = new Set(comp.getClasses());
            }

            const filteredClasses = filterCSSClasses(cssClasses, value, existingClasses);

            if (filteredClasses.length > 0) {
                showDropdown(filteredClasses);
            }
        }
    });

    input.addEventListener('blur', function () {
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

            item.addEventListener('mouseenter', function () {
                selectedIndex = Array.from(dropdownContainer.children).indexOf(this);
                highlightItem(selectedIndex);
            });

            item.addEventListener('mouseleave', function () {
                selectedIndex = -1;
                highlightItem(selectedIndex);
            });

            item.addEventListener('mousedown', e => e.preventDefault());

            item.addEventListener('click', function () {
                const className = this.textContent.trim();
                input.value = className;

                const comp = editor.getSelected();
                if (comp) {
                    comp.addClass(className);
                }

                input.value = '';
                hideDropdown();
                input.focus();
            });

            dropdownContainer.appendChild(item);
        });
    }

    function hideDropdown() {
        dropdownContainer.style.display = 'none';
        isDropdownVisible = false;
        selectedIndex = -1;
    }

    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdownContainer.contains(e.target)) {
            hideDropdown();
        }
    });
}