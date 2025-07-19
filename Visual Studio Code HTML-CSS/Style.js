// --- Lógica JavaScript para el movimiento de la aurora ---
const bodyElement = document.body;

bodyElement.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const sensitivity = 30;

    const offsetXBefore = (mouseX - windowWidth / 2) / (windowWidth / 2) * sensitivity;
    const offsetYBefore = (mouseY - windowHeight / 2) / (windowHeight / 2) * sensitivity;

    const offsetXAfter = (mouseX - windowWidth / 2) / (windowWidth / 2) * -sensitivity;
    const offsetYAfter = (mouseY - windowHeight / 2) / (windowHeight / 2) * -sensitivity;

    bodyElement.style.setProperty('--aurora-before-x', `${offsetXBefore}px`);
    bodyElement.style.setProperty('--aurora-before-y', `${offsetYBefore}px`);
    bodyElement.style.setProperty('--aurora-after-x', `${offsetXAfter}px`);
    bodyElement.style.setProperty('--aurora-after-y', `${offsetYAfter}px`);
});

// --- Lógica JavaScript principal para usuarios y encuestas ---
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const surveySection = document.getElementById('surveySection');
    const createSurveySection = document.getElementById('createSurveySection');
    const surveyListSection = document.getElementById('surveyListSection');
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');

    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginMessageDiv = document.getElementById('loginMessage');

    const registerUsernameInput = document.getElementById('registerUsername');
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const registerMessageDiv = document.getElementById('registerMessage');

    const surveyForm = document.getElementById('surveyForm');
    const surveyMessageDiv = document.getElementById('surveyMessage');

    const newSurveyTitleInput = document.getElementById('newSurveyTitle');
    const questionsContainer = document.getElementById('questionsContainer');
    let questionCounter = 1;

    const surveysListDiv = document.getElementById('surveysList');

    // --- Referencia a la pantalla de inicio ---
    const splashScreen = document.getElementById('splashScreen');

    // --- Funciones de Utilidad ---

    // Función para mostrar mensajes
    const showMessage = (element, message, type) => {
        element.textContent = message;
        element.className = `message ${type}`;
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    };

    // Función para ocultar un mensaje específico
    const hideMessage = (element) => {
        element.classList.add('hidden');
        element.textContent = '';
    };

    // Función para ocultar todas las secciones principales
    const hideAllSections = () => {
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        surveySection.classList.add('hidden');
        createSurveySection.classList.add('hidden');
        surveyListSection.classList.add('hidden');
        hideMessage(loginMessageDiv);
        hideMessage(registerMessageDiv);
        hideMessage(surveyMessageDiv);
    };

    // --- Funciones para alternar entre secciones (accesibles globalmente) ---

    window.showLogin = () => {
        hideAllSections();
        loginSection.classList.remove('hidden');
    };

    window.showRegister = () => {
        hideAllSections();
        registerSection.classList.remove('hidden');
    };

    window.showSurvey = (username = localStorage.getItem('currentUser')) => {
        if (!username) {
            window.showLogin();
            return;
        }
        hideAllSections();
        loggedInUsernameSpan.textContent = username;
        surveySection.classList.remove('hidden');
        loadDefaultSurvey();
    };

    window.showCreateSurvey = () => {
        hideAllSections();
        createSurveySection.classList.remove('hidden');
        newSurveyTitleInput.value = '';
        questionsContainer.innerHTML = '';
        questionCounter = 0;
        window.addQuestionField();
    };

    window.showSurveyList = () => {
        hideAllSections();
        surveyListSection.classList.remove('hidden');
        renderSurveyList();
    };

    // --- Lógica de Usuario (simulada con localStorage) ---
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    window.registerUser = () => {
        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value;

        if (!username || !email || !password) {
            showMessage(registerMessageDiv, 'Por favor, completa todos los campos.', 'error');
            return;
        }
        if (users[username]) {
            showMessage(registerMessageDiv, 'El nombre de usuario ya existe. Intenta con otro nombre.', 'error');
            return;
        }

        users[username] = { email, password };
        saveUsers();
        showMessage(registerMessageDiv, 'Usuario registrado exitosamente. ¡Ahora puedes iniciar sesión!', 'success');
        registerUsernameInput.value = '';
        registerEmailInput.value = '';
        registerPasswordInput.value = '';
        setTimeout(window.showLogin, 1500);
    };

    window.loginUser = () => {
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value;

        if (!username || !password) {
            showMessage(loginMessageDiv, 'Por favor, ingresa tu usuario y contraseña.', 'error');
            return;
        }

        const user = users[username];
        if (user && user.password === password) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            showMessage(loginMessageDiv, 'Inicio de sesión exitoso.', 'success');
            loginUsernameInput.value = '';
            loginPasswordInput.value = '';
            setTimeout(() => window.showSurvey(currentUser), 500);
        } else {
            showMessage(loginMessageDiv, 'Usuario o contraseña incorrectos.', 'error');
        }
    };

    window.logoutUser = () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        window.showLogin();
        showMessage(loginMessageDiv, 'Sesión cerrada correctamente.', 'success');
    };

    // --- Lógica de la Encuesta Principal (Fija) ---
    const loadDefaultSurvey = () => {
        surveyForm.innerHTML = `
            <div class="form-group">
                <label for="question1">1. ¿Qué tan satisfecho estás con nuestra plataforma?</label>
                <select id="question1" required>
                    <option value="">Selecciona una opción</option>
                    <option value="Muy Satisfecho">Muy Satisfecho</option>
                    <option value="Satisfecho">Satisfecho</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Insatisfecho">Insatisfecho</option>
                    <option value="Muy Insatisfecho">Muy Insatisfecho</option>
                </select>
            </div>
            <div class="form-group">
                <label for="question2">2. ¿Qué nuevas funciones te gustaría ver en el futuro?</label>
                <textarea id="question2" rows="4" placeholder="Describe tus sugerencias aquí..." required></textarea>
            </div>
            <div class="form-group">
                <label>3. ¿Con qué frecuencia utilizas la plataforma?</label>
                <div>
                    <input type="radio" id="daily" name="frequency" value="Diario" required>
                    <label for="daily">Diario</label>
                    <input type="radio" id="weekly" name="frequency" value="Semanal" required>
                    <label for="weekly">Semanal</label>
                    <input type="radio" id="monthly" name="frequency" value="Mensual" required>
                    <label for="monthly">Mensual</label>
                    <input type="radio" id="rarely" name="frequency" value="Rara vez" required>
                    <label for="rarely">Rara vez</label>
                </div>
            </div>
            <button type="submit">Enviar Encuesta</button>
        `;
        // Asegúrate de que el event listener se adjunta una sola vez para el formulario por defecto
        surveyForm.removeEventListener('submit', handleSurveySubmit); // Remueve para evitar duplicados
        surveyForm.addEventListener('submit', handleSurveySubmit);
        surveyForm.id = 'surveyForm'; // Asegura que el ID sea el por defecto
        delete surveyForm.dataset.surveyId; // Limpia cualquier ID de encuesta dinámica
    };

    const handleSurveySubmit = (e) => {
        e.preventDefault();

        if (!currentUser) {
            showMessage(surveyMessageDiv, 'Debes iniciar sesión para enviar la encuesta.', 'error');
            return;
        }

        // Verifica si es el formulario de encuesta fija
        if (surveyForm.id === 'surveyForm') {
            const question1 = document.getElementById('question1').value;
            const question2 = document.getElementById('question2').value;
            const question3Input = document.querySelector('input[name="frequency"]:checked');
            const question3 = question3Input ? question3Input.value : '';

            if (!question1 || !question2 || !question3) {
                showMessage(surveyMessageDiv, 'Por favor, responde todas las preguntas de la encuesta.', 'error');
                return;
            }

            const surveyData = {
                timestamp: new Date().toLocaleString(),
                user: currentUser,
                satisfaction: question1,
                future_features: question2,
                frequency: question3,
                surveyId: 'default_survey'
            };
            saveSurveyResponse(surveyData);
            showMessage(surveyMessageDiv, '¡Encuesta enviada exitosamente!', 'success');
            surveyForm.reset();
        } else {
            // Esto manejaría el caso de que handleSurveySubmit se llamara
            // para una encuesta dinámica por error, aunque handleDynamicSurveySubmit
            // debería ser el que se llama.
            console.warn("Manejo de formulario de encuesta inesperado para 'surveyForm'.");
        }
    };
    // El listener principal se adjunta dentro de loadDefaultSurvey para asegurar el contexto correcto.


    // --- Lógica de Creación de Encuestas Dinámicas ---
    window.addQuestionField = () => {
        questionCounter++;
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.dataset.questionId = questionCounter;
        questionBlock.innerHTML = `
            <div class="form-group">
                <label for="questionText_${questionCounter}">Pregunta ${questionCounter}:</label>
                <input type="text" id="questionText_${questionCounter}" placeholder="Texto de la pregunta" required>
            </div>
            <div class="form-group">
                <label for="questionType_${questionCounter}">Tipo de Respuesta:</label>
                <select id="questionType_${questionCounter}" onchange="window.toggleOptions(this, ${questionCounter})">
                    <option value="text">Texto Corto</option>
                    <option value="textarea">Texto Largo</option>
                    <option value="radio">Múltiples Opciones (Radio)</option>
                    <option value="select">Lista Desplegable (Select)</option>
                </select>
            </div>
            <div class="options-container hidden" id="optionsContainer_${questionCounter}">
                <label>Opciones (separadas por coma):</label>
                <input type="text" id="questionOptions_${questionCounter}" placeholder="Opción 1, Opción 2, Opción 3">
            </div>
            <button type="button" class="remove-question-button" onclick="window.removeQuestion(this)">Eliminar Pregunta</button>
        `;
        questionsContainer.appendChild(questionBlock);
    };

    window.removeQuestion = (button) => {
        const questionBlock = button.closest('.question-block');
        questionBlock.remove();
    };

    window.toggleOptions = (selectElement, questionId) => {
        const optionsContainer = document.getElementById(`optionsContainer_${questionId}`);
        if (selectElement.value === 'radio' || selectElement.value === 'select') {
            optionsContainer.classList.remove('hidden');
        } else {
            optionsContainer.classList.add('hidden');
            document.getElementById(`questionOptions_${questionId}`).value = '';
        }
    };

    let surveyDefinitions = JSON.parse(localStorage.getItem('surveyDefinitions')) || [];

    const saveSurveyDefinitions = () => {
        localStorage.setItem('surveyDefinitions', JSON.stringify(surveyDefinitions));
    };

    window.saveNewSurvey = () => {
        const title = newSurveyTitleInput.value.trim();
        if (!title) {
            showMessage(surveyMessageDiv, 'El título de la encuesta no puede estar vacío.', 'error');
            return;
        }

        const questions = [];
        let allQuestionsValid = true;
        questionsContainer.querySelectorAll('.question-block').forEach(qBlock => {
            const qId = qBlock.dataset.questionId;
            const text = document.getElementById(`questionText_${qId}`).value.trim();
            const type = document.getElementById(`questionType_${qId}`).value;
            const optionsInput = document.getElementById(`questionOptions_${qId}`);
            let options = [];

            if (!text) {
                allQuestionsValid = false;
                return;
            }

            if (type === 'radio' || type === 'select') {
                const optionsStr = optionsInput.value.trim();
                if (!optionsStr) {
                    allQuestionsValid = false;
                    return;
                }
                options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
                if (options.length === 0) {
                    allQuestionsValid = false;
                    return;
                }
            }
            questions.push({ text, type, options });
        });

        if (!allQuestionsValid) {
            showMessage(surveyMessageDiv, 'Por favor, completa todas las preguntas y opciones requeridas.', 'error');
            return;
        }
        if (questions.length === 0) {
            showMessage(surveyMessageDiv, 'La encuesta debe tener al menos una pregunta.', 'error');
            return;
        }

        const newSurvey = {
            id: `survey_${Date.now()}`,
            title: title,
            questions: questions
        };

        surveyDefinitions.push(newSurvey);
        saveSurveyDefinitions();
        showMessage(surveyMessageDiv, 'Encuesta guardada exitosamente!', 'success');
        newSurveyTitleInput.value = '';
        questionsContainer.innerHTML = '';
        questionCounter = 0;
        window.addQuestionField(); // Añade la primera pregunta automáticamente para la siguiente creación

        setTimeout(() => window.showSurveyList(), 1500);
    };

    // --- Lógica de la Lista de Encuestas ---
    const renderSurveyList = () => {
        surveysListDiv.innerHTML = '';
        if (surveyDefinitions.length === 0) {
            surveysListDiv.innerHTML = '<p>No hay encuestas disponibles. ¡Crea una!</p>';
            return;
        }

        surveyDefinitions.forEach(survey => {
            const surveyItem = document.createElement('div');
            surveyItem.className = 'survey-item';
            surveyItem.innerHTML = `
                <h3>${survey.title}</h3>
                <p>Preguntas: ${survey.questions.length}</p>
                <button onclick="window.loadAndTakeSurvey('${survey.id}')">Realizar Encuesta</button>
                <button onclick="window.deleteSurvey('${survey.id}')" class="remove-question-button">Eliminar</button>
            `;
            surveysListDiv.appendChild(surveyItem);
        });
    };

    window.loadAndTakeSurvey = (surveyId) => {
        hideAllSections();
        surveySection.classList.remove('hidden');

        const surveyToLoad = surveyDefinitions.find(s => s.id === surveyId);
        if (!surveyToLoad) {
            showMessage(surveyMessageDiv, 'Encuesta no encontrada.', 'error');
            window.showSurveyList();
            return;
        }

        let formContent = '';
        surveyToLoad.questions.forEach((q, index) => {
            const qNum = index + 1;
            formContent += `
                <div class="form-group">
                    <label for="dynamic_q${qNum}">${qNum}. ${q.text}</label>
            `;
            if (q.type === 'text') {
                formContent += `<input type="text" id="dynamic_q${qNum}" name="dynamic_q${qNum}" required>`;
            } else if (q.type === 'textarea') {
                formContent += `<textarea id="dynamic_q${qNum}" name="dynamic_q${qNum}" rows="4" required></textarea>`;
            } else if (q.type === 'radio') {
                q.options.forEach((opt, optIndex) => {
                    formContent += `
                        <div>
                            <input type="radio" id="dynamic_q${qNum}_opt${optIndex}" name="dynamic_q${qNum}" value="${opt}" required>
                            <label for="dynamic_q${qNum}_opt${optIndex}">${opt}</label>
                        </div>
                    `;
                });
            } else if (q.type === 'select') {
                formContent += `<select id="dynamic_q${qNum}" name="dynamic_q${qNum}" required><option value="">Selecciona una opción</option>`;
                q.options.forEach(opt => {
                    formContent += `<option value="${opt}">${opt}</option>`;
                });
                formContent += `</select>`;
            }
            formContent += `</div>`;
        });
        formContent += `<button type="submit">Enviar Encuesta</button>`;

        surveyForm.innerHTML = formContent;
        surveyForm.dataset.surveyId = surveyId; // Guarda el ID de la encuesta actual
        surveyForm.id = 'dynamicSurveyForm'; // Cambia el ID para distinguirlo del formulario fijo

        // Elimina el listener anterior y añade el nuevo para encuestas dinámicas
        surveyForm.removeEventListener('submit', handleSurveySubmit);
        surveyForm.removeEventListener('submit', handleDynamicSurveySubmit); // También remueve si ya existe
        surveyForm.addEventListener('submit', (e) => handleDynamicSurveySubmit(e, surveyId));
    };

    const handleDynamicSurveySubmit = (e, surveyId) => {
        e.preventDefault();

        if (!currentUser) {
            showMessage(surveyMessageDiv, 'Debes iniciar sesión para enviar la encuesta.', 'error');
            return;
        }

        const surveyDefinition = surveyDefinitions.find(s => s.id === surveyId);
        if (!surveyDefinition) {
            showMessage(surveyMessageDiv, 'Error: Definición de encuesta no encontrada.', 'error');
            return;
        }

        const surveyResponses = {
            timestamp: new Date().toLocaleString(),
            user: currentUser,
            surveyId: surveyId,
            responses: {}
        };

        let allQuestionsAnswered = true;
        surveyDefinition.questions.forEach((q, index) => {
            const qNum = index + 1;
            let value = '';

            // Lógica para recolectar respuestas según el tipo de pregunta
            if (q.type === 'text' || q.type === 'textarea' || q.type === 'select') {
                const inputElement = document.getElementById(`dynamic_q${qNum}`);
                if (inputElement) {
                    value = inputElement.value.trim();
                }
            } else if (q.type === 'radio') {
                const checkedRadio = document.querySelector(`input[name="dynamic_q${qNum}"]:checked`);
                if (checkedRadio) {
                    value = checkedRadio.value;
                }
            }

            if (!value) {
                allQuestionsAnswered = false;
            }
            surveyResponses.responses[q.text] = value;
        });

        if (!allQuestionsAnswered) {
            showMessage(surveyMessageDiv, 'Por favor, responde todas las preguntas de la encuesta.', 'error');
            return;
        }

        saveSurveyResponse(surveyResponses);
        showMessage(surveyMessageDiv, '¡Encuesta enviada exitosamente!', 'success');
        surveyForm.reset();
        // Después de enviar, vuelve a la lista de encuestas o a la encuesta por defecto
        setTimeout(() => window.showSurveyList(), 1500); // O window.showSurvey() para la encuesta fija
    };


    window.deleteSurvey = (surveyId) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta encuesta y todas sus respuestas?')) {
            surveyDefinitions = surveyDefinitions.filter(s => s.id !== surveyId);
            saveSurveyDefinitions();

            let allResponses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
            allResponses = allResponses.filter(response => response.surveyId !== surveyId);
            localStorage.setItem('surveyResponses', JSON.stringify(allResponses));

            renderSurveyList();
            showMessage(surveyMessageDiv, 'Encuesta eliminada exitosamente.', 'success');
        }
    };


    const saveSurveyResponse = (response) => {
        const responses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
        responses.push(response);
        localStorage.setItem('surveyResponses', JSON.stringify(responses));
    };

    window.downloadSurveyData = () => {
        const allSurveyResponses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
        if (allSurveyResponses.length === 0) {
            alert('No hay respuestas de encuestas para descargar.');
            return;
        }

        const dataStr = JSON.stringify(allSurveyResponses, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'encuestas_respuestas.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    // --- Lógica de la pantalla de inicio (Splash Screen) ---
    // La duración total de la animación de entrada del texto (2s) más su delay (0.5s)
    const SPLASH_ANIMATION_DURATION = 2500;
    // La duración que el splash screen tardará en desvanecerse (transición de opacidad)
    const SPLASH_FADE_OUT_DURATION = 500;

    // Después de que la animación del título termine
    setTimeout(() => {
        splashScreen.style.opacity = '0'; // Inicia el desvanecimiento del splash screen
        // Después de que el splash screen se haya desvanecido por completo
        setTimeout(() => {
            splashScreen.classList.add('hidden'); // Oculta completamente el splash screen
            // Luego, muestra la sección principal adecuada (login o encuesta si ya hay sesión)
            if (currentUser) {
                window.showSurvey(currentUser);
            } else {
                window.showLogin();
            }
        }, SPLASH_FADE_OUT_DURATION);
    }, SPLASH_ANIMATION_DURATION);
});