window.addEventListener('DOMContentLoaded', () => {
    /*------------------------------Modals------------------------------*/
    function modals(triggerSelector, modalSelector, closeSelector) {
        const modalBtn = document.querySelectorAll(triggerSelector),
              modalContent = document.querySelector(modalSelector),
              modalClose = document.querySelectorAll(closeSelector);
    
        modalBtn.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target) {
                    e.preventDefault();
                }
                modalContent.classList.add('open');
            });
        });
    
        modalClose.forEach(btn => {
            btn.addEventListener('click', () => {
                modalContent.classList.remove('open');
            });
        });
    }
    
    modals('.habits__add', '#modal_habits', '#modal_habits .close');
    modals('.btn_journal', '#modal_journal', '#modal_journal .close');
});