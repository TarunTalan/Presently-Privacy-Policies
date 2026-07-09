/* ==========================================================================
   PRESENTLY PRIVACY POLICY - LOGIC
   Developers: Tarun Talan & Siddhi Goel
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Management ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeText = themeToggleBtn.querySelector('.theme-text');
    
    const sunIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        </svg>
    `;
    
    const moonIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.8 6.5 2.5 12 2.2c.5 0 .9.3 1.1.7.2.4.1.9-.2 1.2-1.8 1.8-2.8 4.3-2.8 6.9 0 2.6 1 5.1 2.8 6.9.3.3.4.8.2 1.2-.2.4-.6.7-1.1.7zm-1.8-3.4c2.8 0 5.4-1.2 7.2-3.3-1.6-1.5-2.6-3.7-2.6-6.1S16.1 4.6 17.7 3c-5 .5-8.8 4.7-8.8 9.8 0 5.2 4.1 9.4 9.1 9.7-.9.1-1.8.1-2.5.1z"/>
        </svg>
    `;

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeUI(savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeUI('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeUI('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.innerHTML = sunIconSvg;
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.innerHTML = moonIconSvg;
            themeText.textContent = 'Dark Mode';
        }
    }

    // --- 2. Mobile Menu Toggle ---
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const tocLinks = document.querySelectorAll('.toc-link');

    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking a TOC link (on mobile viewports)
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // --- 3. Scrollspy (TOC Link Active Highlighting) ---
    const sections = document.querySelectorAll('.policy-section');
    const tocItems = document.querySelectorAll('.toc-list .toc-item');

    function highlightTOC() {
        let scrollPosition = window.scrollY + 120; // offset for headers

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                tocItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.querySelector('a').getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightTOC);
    highlightTOC(); // run initially

    // --- 4. Interactive Data Deletion Form ---
    const deletionForm = document.getElementById('data-deletion-form');
    const successOverlay = document.getElementById('success-overlay');
    const resetFormBtn = document.getElementById('reset-form-btn');
    deletionForm.addEventListener('submit', (e) => {
        const submitBtn = deletionForm.querySelector('.submit-btn');
        // Retrieve values for UI feedback
        const studentId = document.getElementById('form-student-id').value.trim();
        const studentName = document.getElementById('form-name').value.trim();

        if (!studentId || !studentName) {
            return;
        }

        // Inject info into success card
        document.getElementById('success-name').textContent = studentName;
        document.getElementById('success-student-id').textContent = studentId;

        // Custom subject line configuration dynamically
        document.getElementById('form-submit-subject').value = `Presently Data Deletion Request [ID: ${studentId}]`;

        // Custom style spinner keyframes if not present
        if (!document.getElementById('spinner-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spinner-keyframes';
            style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        // Temporarily change button to "Sending..."
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin" style="width:18px;height:18px;animation: spin 1s linear infinite;" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Sending...
        `;

        // Trigger success overlay animation after a brief delay while the form posts natively to the iframe
        setTimeout(() => {
            successOverlay.classList.add('active');
            deletionForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Submit Request
            `;
        }, 1200);
    });

    resetFormBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
    });
});
