// מערך הנתונים הראשי של המשפטים מהתמונות
const sentencesData = [
    {
        q_arabic: 'مَا اسْمُ הַוַלַדּ?',
        q_hebrew: 'מה שמו של הילד?',
        a_arabic: 'اِسْمِي يُوسُف، أَنَا مُسْلِم.',
        a_hebrew: 'שמי יוסף, אני מוסלמי.'
    },
    {
        q_arabic: 'מַה הֵןַ (א)לְ בִּלְדַאן אַלְ מֻהִמַּה?',
        q_hebrew: 'מהן המדינות החשובות?',
        a_arabic: 'إِسْرَائِיל דَوْלَة וַלُבْنَان דَوْلَة.',
        a_hebrew: 'ישראל מדינה ולבנון מדינה.'
    },
    {
        q_arabic: 'מַן הִיא?',
        q_hebrew: 'מי היא?',
        a_arabic: 'וِدَاد תִלְמִיذَة.',
        a_hebrew: 'ודאד תלמידה.'
    },
    {
        q_arabic: 'מַה שְמֹות הַהֹורִים?',
        q_hebrew: 'מה שמות ההורים?',
        a_arabic: 'מَرْיَم אֻמִּי وَאמִיר אַבִּי.',
        a_hebrew: 'מרים אמי ואמיר אבי.'
    },
    {
        q_arabic: 'אֵיכּ יֻסַאפִרֹון?',
        q_hebrew: 'איך הם נוסעים?',
        a_arabic: 'יֻסַאפִר שָרִיף בִּסַיָארַת פֹורְד.',
        a_hebrew: 'שריף נוסע במכונית פורד.'
    },
    {
        q_arabic: 'מַה שְמֹו הָעִיר?',
        q_hebrew: 'מה שם העיר?',
        a_arabic: 'اَلْקُדْس מַדִינַת מֻקַדַסַה.',
        a_hebrew: 'ירושלים עיר קדושה.'
    }
];

let currentSentences = [...sentencesData];

// --- פונקציות לימוד ותרגול (מודול 1 & 2) ---

/**
 * מציג את כל המשפטים במקטע התרגול
 * @param {Array} arr - מערך המשפטים להצגה
 */
function renderSentences(arr) {
    const list = document.getElementById('sentences-list');
    list.innerHTML = ''; 

    arr.forEach((item, index) => {
        const itemHTML = `
            <div class="sentence-item" data-index="${index}">
                <div class="answer-text">
                    <span class="arabic-line">${item.a_arabic}</span>
                    <span class="translation-line hidden">${item.a_hebrew}</span>
                </div>
                <div class="question-text">
                    <span class="arabic-line">${item.q_arabic}</span>
                    <span class="translation-line hidden">${item.q_hebrew}</span>
                </div>
            </div>
        `;
        list.innerHTML += itemHTML;
    });
}

/**
 * מחליף את מצב התרגום העברי (גלוי/מוסתר)
 */
function toggleTranslations() {
    const translations = document.querySelectorAll('#sentences-list .translation-line');
    const button = document.getElementById('toggleTranslationsBtn');
    
    translations.forEach(t => {
        t.classList.toggle('hidden');
    });

    // שינוי טקסט הכפתור
    const isHidden = translations[0].classList.contains('hidden');
    button.textContent = isHidden ? 'הצג תרגום עברי' : 'הסתר תרגום עברי';
}

/**
 * ערבוב מערך (אלגוריתם פישר-ייטס)
 * @param {Array} array - המערך לערבוב
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- פונקציות חידון (מודול 3) ---

/**
 * יצירת חידון רב-ברירה (בחירת תרגום)
 */
function generateQuiz() {
    const quizArea = document.getElementById('quiz-area');
    quizArea.innerHTML = ''; // ניקוי אזור החידון
    
    // בוחר 4 משפטים אקראיים לחידון
    let quizData = [...sentencesData]; // עותק של הנתונים
    shuffleArray(quizData);
    const selectedSentences = quizData.slice(0, 4); 

    selectedSentences.forEach((correctAnswer, index) => {
        // בונה רשימה של כל התרגומים האפשריים (כולל הנכון)
        const allTranslations = sentencesData.map(s => s.a_hebrew);
        
        // בוחר 3 תרגומים שגויים רנדומליים, מוודא שאינם התשובה הנכונה
        const incorrectOptions = allTranslations
            .filter(t => t !== correctAnswer.a_hebrew);

        shuffleArray(incorrectOptions);
        
        const options = [correctAnswer.a_hebrew, ...incorrectOptions.slice(0, 2)];
        shuffleArray(options); // מערבב את הסדר של התשובות

        const qHTML = `
            <div class="quiz-question" data-question-id="${index}">
                <p>תרגם את המשפט: "${correctAnswer.a_arabic}"</p>
                ${options.map((opt, i) => `
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="${opt}" data-correct="${opt === correctAnswer.a_hebrew ? 'true' : 'false'}"> 
                        ${opt}
                    </label>
                `).join('')}
            </div>
        `;
        quizArea.innerHTML += qHTML;
    });
    
    document.getElementById('checkQuizBtn').classList.remove('hidden');
}

/**
 * בדיקת תשובות החידון
 */
function checkQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    const resultBox = document.getElementById('quiz-result');
    let correctCount = 0;

    questions.forEach(q => {
        const selected = q.querySelector('input:checked');
        const labels = q.querySelectorAll('.option-label');
        
        // ניקוי סימונים קודמים ורקע
        labels.forEach(l => {
            l.style.backgroundColor = 'white';
            l.style.border = '1px solid #ccc';
        });

        if (selected) {
            if (selected.dataset.correct === 'true') {
                correctCount++;
                selected.parentElement.style.backgroundColor = '#c8e6c9'; // ירוק בהיר לנכון
                selected.parentElement.style.border = '1px solid #4caf50';
            } else {
                selected.parentElement.style.backgroundColor = '#ffcdd2'; // אדום בהיר לטעות
                selected.parentElement.style.border = '1px solid #f44336';
            }
        }
        
        // סימון התשובה הנכונה
        const correctAnswer = q.querySelector('input[data-correct="true"]');
        if (correctAnswer) {
            correctAnswer.parentElement.style.border = '2px solid #4caf50';
        }
    });

    // הצגת התוצאה
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
        <h3>תוצאות החידון:</h3>
        <p>צברת <strong>${correctCount}</strong> תשובות נכונות מתוך <strong>${questions.length}</strong> שאלות.</p>
        <p>${correctCount === questions.length ? '🥳 כל הכבוד! מוכן למבחן!' : '✍️ עוד קצת תרגול ותצליח! נסה שוב או חזור לתרגל את המשפטים.'}</p>
    `;
}

// --- אירועי אתחול ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. אתחול מודול 1: תצוגת פרטי אותיות בלחיצה
    document.querySelectorAll('.letter-card').forEach(card => {
        card.addEventListener('click', function() {
            const detailsBox = document.getElementById('letter-details');
            const name = this.getAttribute('data-name');
            const hebrew = this.getAttribute('data-hebrew');
            const arabic = this.textContent.trim();
            
            detailsBox.innerHTML = `
                האות **${arabic}** (${name}) נשמעת בערך כמו **${hebrew}**.
                <br> זכור: היא נשמעת שונה מהאות המקבילה לה בעברית!
            `;
        });
    });

    // 2. אתחול מודול 2: הצגת המשפטים
    renderSentences(currentSentences);

    // כפתור הצגה/הסתרה
    document.getElementById('toggleTranslationsBtn').addEventListener('click', toggleTranslations);
    
    // כפתור ערבוב
    document.getElementById('shuffleBtn').addEventListener('click', () => {
        shuffleArray(currentSentences);
        renderSentences(currentSentences);
    });

    // 3. אתחול מודול 3: טעינת החידון
    generateQuiz();
    document.getElementById('checkQuizBtn').addEventListener('click', checkQuiz);
});