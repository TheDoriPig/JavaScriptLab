let startTest = confirm("Желаете пройти регистрацию?");

if (!startTest) {
    document.getElementById('output').innerHTML = "<h1>Регистрация отменена</h1>";
} else {
    let outputHTML = `
    <form name="registration" id="registration">
        <h3>Форма для регистрации</h3>
        Фамилия: <input type="text" required name="lname" value=""><br><br>
        Имя: <input type="text" required name="name" value=""><br><br>
        Пол: <input type="radio" required name="gender" id="g1" value="1"><label for="g1">Мужчина</label>
             <input type="radio" required name="gender" id="g2" value="2"><label for="g2">Женщина</label><br><br>
        Возраст: <input type="number" required name="age" value=""><br><br>
        Логин: <input type="text" required name="login" value=""><br><br>
        Пароль: <input type="password" required name="password" value=""><br><br>
        Email: <input type="email" required name="email" value=""><br><br>
        Любимый цвет: <input type="text" name="color" value=""><br><br>
        Кого любите больше: <input type="radio" required name="pet" id="p1" value="1"><label for="p1">Кошек</label>
                            <input type="radio" required name="pet" id="p2" value="2"><label for="p2">Собак</label><br><br>
        <button type="submit">Регистрация</button>
        <button type="reset">Очистка полей</button>
    </form>
    `;

    document.getElementById('output').innerHTML = outputHTML;

    const form = document.getElementById('registration');

    form.addEventListener('submit', function handleRegister(event) {
        event.preventDefault();

        const userData = {
            lname: form.lname.value.trim(),
            name: form.name.value.trim(),
            gender: form.gender.value === '1' ? 'Мужчина' : 'Женщина',
            age: form.age.value,
            login: form.login.value.trim(),
            email: form.email.value.trim(),
            color: form.color.value.trim(),
            pet: form.pet.value === '1' ? 'Кошек' : 'Собак'
        };

        form.style.display = 'none';
        startTestQuiz(userData);
    });
}

const questions = [
    "Вам предстоит ординарная или деловая встреча. Выбивает ли Вас ее ожидание из колеи?",
    "Вызывает ли у Вас смятение и неудовольствие поручение выступить с докладом, сообщением, информацией на каком-либо совещании, собрании или тому подобном мероприятии?",
    "Не откладываете ли Вы визит к врачу до последнего момента?",
    "Вам предлагают выехать в командировку в город, где Вы никогда не бывали. Приложите ли Вы максимум усилий, чтобы избежать этой командировки?",
    "Любите ли Вы делиться своими переживаниями с кем бы то ни было?",
    "Раздражаетесь ли Вы, если незнакомый человек на улице обратится к Вам с просьбой (показать дорогу, назвать время, ответить на какой-то вопрос)?",
    "Верите ли Вы, что существует проблема «отцов и детей» и что людям разных поколений трудно понимать друг друга?",
    "Постесняетесь ли Вы напомнить знакомому, что он забыл Вам вернуть деньги, которые занял несколько месяцев назад?",
    "В ресторане либо в столовой Вам подали явно недоброкачественное блюдо. Промолчите ли Вы, лишь рассерженно отодвинув тарелку?",
    "Оказавшись один на один с незнакомым человеком, Вы не вступите с ним в беседу и будете тяготиться, если первым заговорит он. Так ли это?",
    "Вас приводит в ужас любая длинная очередь, где бы она ни была (в магазине, библиотеке, кассе кинотеатра). Предпочитаете ли Вы отказаться от своего намерения или встанете в хвост и будете томиться в ожидании?",
    "Боитесь ли Вы участвовать в какой-либо комиссии по рассмотрению конфликтных ситуаций?",
    "У Вас есть собственные сугубо индивидуальные критерии оценки произведений литературы, искусства, культуры и никаких чужих мнений на этот счет Вы не приемлете. Это так?",
    "Услышав где-либо в кулуарах высказывание явно ошибочной точки зрения по хорошо известному Вам вопросу, предпочитаете ли Вы промолчать и не вступать в разговор?",
    "Вызывает ли у Вас досаду чья-либо просьба помочь разобраться в том или ином служебном вопросе или учебной теме?",
    "Охотнее ли Вы излагаете свою точку зрения (мнение, оценку) в письменной форме, чем в устной?"
];

const answerOptions = [
    { text: "Да", score: 2 },
    { text: "Иногда", score: 1 },
    { text: "Нет", score: 0 }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let testStartTime = null;
let currentUserData = null;
let testWindow = null;

function startTestQuiz(userData) {
    currentUserData = userData;
    currentQuestionIndex = 0;
    userAnswers = [];
    testStartTime = new Date();
    createTestWindow();
}

function createTestWindow() {
    if (testWindow && !testWindow.closed) {
        testWindow.close();
    }
    
    testWindow = window.open('', 'TestWindow', 'width=550,height=400,left=300,top=100');
    
    if (!testWindow) {
        alert("Разрешите всплывающие окна");
        return;
    }
    
    testWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Тест</title>
        </head>
        <body>
            <div id="questionNumber"></div>
            <div id="questionText"></div>
            <div id="optionsContainer"></div>
            <br>
            <button id="nextBtn">Следующий вопрос</button>
            <button id="cancelBtn">Отмена</button>
            <script>
                let selectedValue = null;
                let currentIndex = 0;
                let totalQuestions = window.opener.getTotalQuestions();
                
                function loadQuestion() {
                    const data = window.opener.getQuestionData(currentIndex);
                    if (!data) return;
                    
                    document.getElementById('questionNumber').innerHTML = 'Вопрос ' + (currentIndex + 1) + ' из ' + data.total;
                    document.getElementById('questionText').innerHTML = data.question;
                    
                    const optionsContainer = document.getElementById('optionsContainer');
                    optionsContainer.innerHTML = '';
                    
                    const savedAnswer = window.opener.getAnswer(currentIndex);
                    selectedValue = savedAnswer !== undefined ? savedAnswer : null;
                    
                    for (let i = 0; i < data.options.length; i++) {
                        const opt = data.options[i];
                        const radioId = 'opt_' + i;
                        const checked = (selectedValue === opt.score) ? 'checked' : '';
                        optionsContainer.innerHTML += '<input type="radio" name="answer" id="' + radioId + '" value="' + opt.score + '" ' + checked + '><label for="' + radioId + '">' + opt.text + '</label><br>';
                    }
                    
                    const radios = document.querySelectorAll('input[name="answer"]');
                    for (let i = 0; i < radios.length; i++) {
                        radios[i].onclick = function() {
                            selectedValue = parseInt(this.value);
                            window.opener.setAnswer(currentIndex, selectedValue);
                            document.getElementById('nextBtn').disabled = false;
                        };
                    }
                    
                    document.getElementById('nextBtn').disabled = (selectedValue === null);
                }
                
                document.getElementById('nextBtn').onclick = function() {
                    if (selectedValue === null) {
                        alert('Выберите ответ');
                        return;
                    }
                    if (currentIndex + 1 < totalQuestions) {
                        currentIndex++;
                        loadQuestion();
                    } else {
                        window.opener.finishTest();
                        window.close();
                    }
                };
                
                document.getElementById('cancelBtn').onclick = function() {
                    if (confirm('Прервать тест?')) {
                        window.opener.cancelTest();
                        window.close();
                    }
                };
                
                loadQuestion();
            <\/script>
        </body>
        </html>
    `);
    
    testWindow.document.close();
}

function getTotalQuestions() {
    return questions.length;
}

function getQuestionData(index) {
    if (index >= questions.length) return null;
    return {
        question: questions[index],
        options: answerOptions,
        total: questions.length
    };
}

function getAnswer(index) {
    return userAnswers[index];
}

function setAnswer(index, value) {
    userAnswers[index] = value;
}

function finishTest() {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime - testStartTime) / 1000);
    
    let totalScore = 0;
    for (let i = 0; i < userAnswers.length; i++) {
        totalScore += userAnswers[i] || 0;
    }
    
    let resultText = "";
    
    if (totalScore >= 30 && totalScore <= 31) {
        resultText = `Вы явно некоммуникабельны, и это Ваша беда, так как больше всего страдаете от этого Вы сами. Но и близким Вам людям нелегко.
        На Вас трудно положиться в деле, которое требует групповых усилий. Старайтесь быть общительнее, контролируйте себя.`;
    } else if (totalScore >= 25 && totalScore <= 29) {
        resultText = `Вы замкнуты, неразговорчивы, предпочитаете одиночество, поэтому у Вас мало друзей. 
        Новая работа и необходимость новых контактов если и не ввергают Вас в панику, то надолго выводят из равновесия. 
        Вы знаете эту особенность своего характера и бываете недовольны собой. Но не ограничивайтесь только таким недовольством – в 
        Вашей власти переломить эти особенности характера. Разве не бывает, что при какой-либо сильной увлеченности Вы приобретаете вдруг 
        полную коммуникабельность? Стоит только встряхнуться.`;
    } else if (totalScore >= 19 && totalScore <= 24) {
        resultText = `Вы в известной степени общительны и в незнакомой обстановке чувствуете себя вполне уверенно. Новые проблемы Вас не пугают. 
        И все же с новыми людьми сходитесь с оглядкой, в спорах и диспутах участвуют неохотно. В Ваших высказываниях порой слишком много сарказма, 
        без всякого на то основания. Эти недостатки исправимы.`;
    } else if (totalScore >= 14 && totalScore <= 18) {
        resultText = `У вас нормальная коммуникабельность. Вы любознательны, охотно слушаете интересного собеседника, достаточно терпеливы в общении, 
        отстаиваете свою точку зрения без вспыльчивости. Без неприятных переживаний идете на встречу с новыми людьми. В то же время не любите шумных компаний; 
        экстравагантные выходки и многословие вызывают у Вас раздражение.`;
    } else if (totalScore >= 9 && totalScore <= 13) {
        resultText = `Вы весьма общительны (порой, быть может, даже сверх меры). Любопытны, разговорчивы, любите высказываться по разным вопросам, что, 
        бывает, вызывает раздражение окружающих. Охотно знакомитесь с новыми людьми. Любите бывать в центре внимания, никому не отказываете в просьбах, 
        хотя не всегда можете их выполнить. Бывает, вспылите, но быстро отходите. Чего Вам недостает, так это усидчивости, терпения и отваги при столкновении с 
        серьезными проблемами. При желании, однако, Вы можете себя заставить не отступать.`;
    } else if (totalScore >= 4 && totalScore <= 8) {
        resultText = `Вы, должно быть, «рубаха-парень». Общительность бьет из Вас ключом. Вы всегда в курсе всех дел. Вы любите принимать участие во всех дискуссиях, 
        хотя серьезные темы могут вызвать у Вас мигрень или даже хандру. Охотно берете слово по любому вопросу, даже если имеете о нем поверхностное представление. 
        Всюду чувствуете себя в своей тарелке. Беретесь за любое дело, хотя не всегда можете успешно довести его до конца. По этой самой причине руководители и 
        коллеги относятся к Вам с некоторой опаской и сомнениями. Задумайтесь над этими фактами.`;
    } else {
        resultText = `Ваша коммуникабельность носит болезненный характер. Вы говорливы, многословны, вмешиваетесь в дела, которые не имеют к Вам никакого отношения. 
        Беретесь судить о проблемах, в которых совершенно не компетентны. Вольно или невольно Вы часто бываете причиной разного рода конфликтов в Вашем окружении. 
        Вспыльчивы, обидчивы, нередко бываете необъективны. Серьезная работа не для Вас. Людям – и на работе, и дома, и вообще повсюду – трудно с Вами. 
        Да, Вам надо поработать над собой и своим характером! Прежде всего воспитывайте в себе терпеливость и сдержанность, уважительно относитесь к людям, 
        наконец, подумайте о своем здоровье – такой стиль жизни не проходит бесследно.`;
    }
    
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeString = minutes + " мин " + seconds + " сек";
    
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <h3>Результаты тестирования</h3>
        <p><strong>Фамилия:</strong> ${currentUserData.lname}</p>
        <p><strong>Имя:</strong> ${currentUserData.name}</p>
        <p><strong>Пол:</strong> ${currentUserData.gender}</p>
        <p><strong>Возраст:</strong> ${currentUserData.age}</p>
        <p><strong>Логин:</strong> ${currentUserData.login}</p>
        <p><strong>Email:</strong> ${currentUserData.email}</p>
        <p><strong>Любимый цвет:</strong> ${currentUserData.color || "не указан"}</p>
        <p><strong>Любит больше:</strong> ${currentUserData.pet}</p>
        <p><strong>Баллы:</strong> ${totalScore} из 32</p>
        <p><strong>Результат:</strong> ${resultText}</p>
        <p><strong>Время:</strong> ${timeString}</p>
        <br><button onclick="location.reload()">Пройти заново</button>
    `;
    
    const successBlock = document.getElementById('successMessage');
    if (successBlock) {
        successBlock.style.display = 'none';
    }
}

function cancelTest() {
    if (confirm('Тест прерван. Начать заново?')) {
        location.reload();
    }
}