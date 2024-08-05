window.addEventListener('DOMContentLoaded', () => {
    /*------------------------------Common------------------------------*/
    // Remove element by clicking outside target
    document.addEventListener('click', function(event) {
        if(document.querySelector('.habit_actions') && !event.target.classList.contains('habits-item__name')) {
            document.querySelector('.habit_actions').remove();
        }
        if(document.querySelector('.habit_states') && !event.target.classList.contains('habits-item__day')) {
            document.querySelector('.habit_states').remove();
        }
    });
    
    // Change text in DOM element
    function editName (parent, maxlength) {
        const field = document.createElement('input');
        field.classList.add('edit_input');
        field.setAttribute('maxlength', maxlength)
        field.value = parent.childNodes[0].textContent;
    
        parent.append(field);    
    
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                parent.textContent = field.value;
                saveHabits();
            }
        });
    }
    
    // Get week number
    function getWeekNumber() {
        const targetDate = new Date(Date.now());
        targetDate.setDate(targetDate.getDate() + 4 - (targetDate.getDay() || 7));
        const yearStart = new Date(targetDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((targetDate - yearStart) / 86400000) + 1) / 7);
    
        return weekNumber;
    }
    
    // Get week range 
    function getWeek () {
        const options = {day: 'numeric', month: 'long'};
        const dateFormatter = new Intl.DateTimeFormat('ru-RU', options);
        const startDate = new Date(2024, 7, 4);
    
        let weekStart = new Date(startDate);
        let weekEnd = new Date(startDate);
    
        weekStart = dateFormatter.format(weekStart);
        weekEnd = dateFormatter.format(weekEnd.setDate(weekEnd.getDate() - 6));
    
        return `${weekStart} - ${weekEnd}`
    }

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
    
    function closeModal () {
        document.querySelector('.modal').classList.remove('open');
    }
    
    modals('.habits__add', '#modal_habits', '#modal_habits .close');
    modals('.btn_journal', '#modal_journal', '#modal_journal .close');

    /*------------------------------Habits------------------------------*/
    /*
        ТЗ: 
        1. Реализовать создание/удаление/переименование привычек; (+)
        2. При нажатии на привычку - выбор из 3 состояний: выполнено, провалено, пропусить; (+)
        3. Изменять состояние привычки возможно только в текущем и предыдущих днях недели; (+)
        4. После заполнения всех привычек, появляется возможность отправить данные в журнал привычек; (+)
        5. В журнале создаем статистику привычек с эффективностью выполнения
        6. Всё сохраняем в localstorage, в виде разметки. (+)
    */
    
    const habits = document.querySelector('.habits');
    const habitsContainer = document.querySelector('.habits__list');
    const habitsTrackerContainer = document.querySelector('.habits-tracker__row');
    const currentDate = new Date(Date.now());
    
    if (localStorage.getItem('habitsHtml')) {
        habitsContainer.innerHTML = localStorage.getItem('habitsHtml');
    }
    
    // Create habit
    function createHabits () {
        const habitsInput = document.querySelector('#habits_input'),
              habitsAdd = document.querySelector('#habits_add');
        let counter = 1;
    
        habitsAdd.addEventListener('click', function (e) {
            e.preventDefault();     
            
            const habs = document.querySelectorAll('.habits-item__name');
            const habs2 = Array.from(habs);
    
            if (habitsInput.value === '') {
                alert('Введи название привычки, долбоеб');
            }
            else if (habs2.some(item => item.textContent === habitsInput.value)) {
                alert('Такая привычка уже существует, склерозный даун');
            }        
            else{
                const habit = document.createElement('div');
                habit.setAttribute('data-id', counter);
                habit.classList.add('habits-item');
                habit.innerHTML = `
                    <div class="habits-item__name">${habitsInput.value}</div>
                    <div class="habits-item__week">
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                        <div class="habits-item__day"></div>
                    </div>
                `
                habitsContainer.append(habit)
                habitsInput.value = '';
                counter += 1;
                closeModal();
            }
            saveHabits();
            disableHabits();
        });
    }
    createHabits();
    
    // Remove/rename habit
    function editHabits () {
        habitsContainer.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('habits-item__name')) {
                const habitActions = document.createElement('div');
                habitActions.classList.add('habit_actions')
                habitActions.innerHTML = `
                    <div class="habit_remove">x</div>
                    <div class="habit_edit">></div>
                `
                document.querySelectorAll('.habit_actions').forEach(item => {
                    item.remove();
                });
                target.append(habitActions);
    
            }
    
            if (target.classList.contains('habit_edit')) {
                editName(target.closest('.habits-item__name'), 15);
                document.querySelectorAll('.habit_actions').forEach(item => {
                    item.remove();
                });
            }
    
            if (target.classList.contains('habit_remove')) {
                target.closest('.habits-item').remove();
            }        
        });
        saveHabits();
    }
    editHabits();
    
    // Toggle habit's state
    function toggleHabits () {
        habitsContainer.addEventListener('click', function (e) {
            const target = e.target;
    
            if (target.classList.contains('habits-item__day') && !target.classList.contains('disabled')) {
                const habitState = document.createElement('div');
                habitState.classList.add('habit_states')
                habitState.innerHTML = `
                    <div class="habit_done">+</div>
                    <div class="habit_fail">-</div>
                    <div class="habit_skip">></div>
                `
                document.querySelectorAll('.habit_states').forEach(item => {
                    item.remove();
                });
                target.append(habitState);
            }
            
            if (target.classList.contains('habit_done')) {
                target.closest('.habits-item__day').className = 'habits-item__day done completed';
                document.querySelector('.habit_states').remove();
            }
            else if(target.classList.contains('habit_fail')) {
                target.closest('.habits-item__day').className = 'habits-item__day done fail';
                document.querySelector('.habit_states').remove();
            }
            else if(target.classList.contains('habit_skip')) {
                target.closest('.habits-item__day').className = 'habits-item__day done skip';
                document.querySelector('.habit_states').remove();
            }
    
            saveHabits();
        });
    }
    toggleHabits();
    
    // Disable habit in future days of week
    function disableHabits () {
        const converted = new Date(Date.now());   
        const week = converted.getDay();
        const habitsDays = document.querySelectorAll('.habits-item');
    
        habitsDays.forEach(item => {
            const parentElement = item.querySelectorAll('.habits-item__day');
            for (i = 0; i < parentElement.length; i++) {
                if (i >= week && week !== 0) {
                    parentElement[i].classList.add('disabled');
                }
            }
        });
    
        saveHabits();
    }
    disableHabits();
    
    // Push habits in tracker
    function habitsTracker () {
        const habitsBody = document.querySelector('.habits__body-inner').innerHTML;
        const habitsTrackerblock = document.createElement('div');
        habitsTrackerblock.classList.add('habits-tracker__block');
        habitsTrackerblock.innerHTML = `
            <h2 class="habits-tracker__title">Неделя ${getWeekNumber()} [${getWeek()}]</h2>
            ${habitsBody}
        `
        
        habitsTrackerContainer.append(habitsTrackerblock);
        saveHabitsTracker();
    }
    
    // Reset habits
    function habitsReset () {
        const habitsItems = habits.querySelectorAll('.habits-item__day');
        const habitsSend = document.querySelector('.habits__send');
        const habitsArr = Array.from(habitsItems);
        const deadline = currentDate.getDay() === 1 && 
                         currentDate.getHours() == 19 && 
                         currentDate.getMinutes() === 41 && 
                         currentDate.getSeconds() === 30;
    
        if (habitsArr.every(item => item.classList.contains('done'))) {
            habitsSend.classList.remove('hide');
        }
    
        habitsSend.addEventListener('click', function () {
            this.classList.add('hide');
            habitsItems.forEach(item => {
                item.className = 'habits-item__day';
            });   
        });
    
        saveHabits ();
        habitsTracker();
        saveHabitsTracker();
    }
    habitsReset();
    
    // Tracker's statistic
    function habitsTrackerStats () {
        const habitsTrackerItems = habitsTrackerContainer.querySelectorAll('[data-id]');
        const uniqueHabits = Array.from(habitsTrackerItems).reduce((acc, item) => {
            const attr = item.getAttribute('data-id');
    
            if (!acc[attr]) {
                acc[attr] = item;
            }
            return acc;
        }, {});
        
        const uniqueHabitsArr = Object.values(uniqueHabits);
    
        uniqueHabitsArr.forEach(item => {
            const habitsStatsContainer = document.querySelector('.habits-tracker__list');
            const habitsStatsName = item.querySelector('.habits-item__name').textContent;
            const habitsStatsDays = item.querySelectorAll('.habits-item__day');
            const habitsStatsComplete = item.getElementsByClassName('completed');
            const habitsStatsFail = item.getElementsByClassName('fail');
            const habitsStatsSkip = item.getElementsByClassName('skip');
            const habitsStatsEfficiency = Math.round(habitsStatsComplete.length / habitsStatsDays.length * 100);
    
            const habitsStatsItem = document.createElement('div');
            habitsStatsItem.classList.add('habits-tracker-item');
            habitsStatsItem.innerHTML = `
                <div class="habits-tracker-item__top">
                    <div class="habits-tracker-item__title">${habitsStatsName}</div>
                    <div class="habits-tracker-item__count">
                        Количество: ${habitsStatsDays.length}
                        (<span>${habitsStatsComplete.length}</span>
                        <span>${habitsStatsFail.length}</span>
                        <span>${habitsStatsSkip.length}</span>)
                    </div>
                    <div class="habits-tracker-item__percent">Эффективность ${habitsStatsEfficiency} %</div>
                </div>
                <div class="habits-tracker-item__bar"><span style="width: ${habitsStatsEfficiency}%"></span></div>
            `
            habitsStatsContainer.append(habitsStatsItem); 
        });
    
    }
    habitsTrackerStats();
    
    // Save habits in LS
    function saveHabitsTracker () {
        localStorage.setItem('habitsTracker', habitsTrackerContainer.innerHTML)
    }
    function saveHabits () {
        localStorage.setItem('habitsHtml', habitsContainer.innerHTML)
    }
    if (localStorage.getItem('habitsTracker')) {
        habitsTrackerContainer.innerHTML = localStorage.getItem('habitsTracker');
    }
});