let startTest = confirm("Желаете пройти регистрацию?");

        if (!startTest) {
            document.getElementById('output').innerHTML = "<h1>Регистрация отменена</h1>";
        } else {
            let outputHTML = `
            <form name="registration">
                <h3>Форма для регистрации</h3>
                
                Фамилия: <input type="text" required name="lname" value=""><br><br>
                Имя: <input type="text" required name="name" value=""><br><br>
                Пол:    <input type="radio" required name="gender" id="g1" val- ue="1">
                        <label for="g1">Мужчина</label>
                        <input type="radio" required name="gender" id="g2" val- ue="2">
                        <label for="g2">Женщина</label><br><br>
                Возраст: <input type="text" required name="age" value=""><br><br>
                Логин: <input type="text" required name="login" value=""><br><br>
                Пароль: <input type="password" required name="password" value=""><br><br>
                Email: <input type="email" required name="email" value=""><br><br>
                Любимый цвет: <input type="text" name="color" value=""><br><br>
                Кого любите больше: <input type="radio" required name="pet" id="g1" val- ue="1">
                                    <label for="g1">Кошек</label>
                                    <input type="radio" required name="pet" id="g2" val- ue="2">
                                    <label for="g2">Собак</label><br><br>
                <button type="submit">Регистрация</button>
                <button type="reset">Очистка полей</button>
            </form>
            `;
            document.getElementById('output').innerHTML = outputHTML;
            function handleRegister(event) {
            event.preventDefault();

            const form = document.getElementById('registration');
            const successBlock = document.getElementById('successMessage');

            form.style.display = 'none';
            successBlock.style.display = 'block';
            }
        }