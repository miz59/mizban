export function createCSSClassDropdown(input, cssClasses) {
    const existingDropdown = document.getElementById('cssClassDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'cssClassDropdown';
    dropdownContainer.style.cssText = `
        width: 100%;
        height:calc(33px * 3);
        overflow-y: auto;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: none;
        margin-top:1rem;
    `;

    // input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(dropdownContainer);

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
    }

    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdownContainer.contains(e.target)) {
            hideDropdown();
        }
    });
}