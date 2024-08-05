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