(function() {
    var theme = localStorage.getItem('theme') || 'system';
    applyTheme(theme);

    document.documentElement.classList.add('preload');
})();

window.onload = function() {
    document.documentElement.classList.remove('preload');
    setCheckedAttribute();
};

function changeTheme(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
}

function setCheckedAttribute() {
    var theme = localStorage.getItem('theme') || 'system';
    document.getElementById(theme).checked = true;
}