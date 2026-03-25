/* ============================================================
	MAIN NAVIGATION
============================================================ */
document.querySelectorAll('.book').forEach(book => {
    book.addEventListener('click', (event) => {
        // Only proceed if the click came from the spine (or inside it)
        const spine = event.target.closest('.book-spine');
        if (!spine) return;

        const link = book.getAttribute('data-link');

        if (book.classList.contains('turning')) return;

        book.classList.add('turning');

        setTimeout(() => {
            window.location.href = link;
        }, 500);
    });
});