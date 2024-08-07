/*------------------------------Modals------------------------------*/
function modals(triggerSelector, modalSelector, closeSelector) {
    const modalBtn = document.querySelectorAll(triggerSelector),
          modalContent = document.querySelector(modalSelector),
          modalClose = document.querySelectorAll(closeSelector),
          modals = document.querySelectorAll('.modal');

    modalBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target) {
                e.preventDefault();
            }

            modals.forEach(item => {
                item.classList.remove('open');
            });

            modalContent.classList.add('open');
        });
    });

    modalClose.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal();
        });
    });
}

function closeModal () {
    document.querySelectorAll('.modal').forEach(item => {
        item.classList.remove('open');
        document.querySelector('.m_habits-form__message').classList.add('hide');
    });
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

modals('.habits__add', '#modal_habits', '#modal_habits .close');

modals('.btn_quartergoals', '#modal_quartergoals', '#modal_quartergoals .close');
modals('.btn_goals', '#modal_goals', '#modal_goals .close');
modals('.btn_finances', '#modal_finances', '#modal_finances .close');
modals('.btn_training', '#modal_training', '#modal_training .close');
modals('.btn_projects', '#modal_projects', '#modal_projects .close');
modals('.btn_journal', '#modal_journal', '#modal_journal .close');
modals('.btn_profile', '#modal_profile', '#modal_profile .close');