// Переменная для хранения списка городов
let cities = [];
// Переменная для хранения списка использованных городов
let used_cities = [];
// Переменные имен игроков
let first_name = "";
let second_name = "";
// Переменная, определяющяя является ли ход ходом первого игрока
let is_first = true;
// Переменная для хранения последнего введенного города
let last_city = "";

/* 
    Метод, вызываемый во время загрузки страницы.
    Запрашивает список городов по ссылке и получает из него имена.
    Метод асинхронный, так как мы хотим не задерживать загрузку страницы ожиданием данных.
*/
const load = async () => {
  // С помощью интерфейса Fetch API мы запрашиваем файл с GitHub. С помощью await указываем, что сайту не нужно ждать окончания загрузки.
  const prev_cities = await fetch(
    "https://raw.githubusercontent.com/aZolo77/citiesBase/master/cities.json"
  );
  // Получаем содержимое ответа в виде строки. Await служит той же задаче, что и предыдущий.
  const data = await prev_cities.text();
  // Преобразуем строку в объект, к полям которого уже можем обращаться.
  const parsed = JSON.parse(data);
  /* 
        Преобразуем объект в массив пар ключ/значение и с помощью перебора из каждой сущности города (где были еще регионы, страны и т.д.) получаем
        имя, после чего помещаем его в список городов.
    */
  Object.entries(parsed.city).forEach(([_, value]) => {

    
    cities.push(value.name);
  });
};

/*
    Метод проверки и сохранения имени. В качестве параметра передаем, поле какого пользователя проверяем.
*/
const set_name = (type) => {
  // Если проверяем поле первого игрока
  if (type === "first_name") {
    // Получаем значение поля по id
    first_name = document.getElementById("first_name").value;

    // Если поле было пустым
    if (!first_name) {
      // Делаем поле ошибки видимым. Оно уже хранит текст описания ошибки.
      document.getElementById("first_name_error").classList.add('display_class');
    }
    // Иначе
    else {
      // Отключает ввод текста в поле и кнопку, а также прячем поле с ошибкой, если оно было видно.
      document.getElementById("first_name").disabled = true;
      document.getElementById("first_name_button").disabled = true;
      // Изменяем цвет кнопки на зеленый и текст - на белый.
      document.getElementById("first_name_button").classList.add('button_inactive');
      // Убираем стиль видимости для ошибки
      document.getElementById("first_name_error").classList.remove('display_class');
    }
  }
  // Если проверяем поле второго игрока
  else {
    // Получаем значение поля по id
    second_name = document.getElementById("second_name").value;

    // Если поле было пустым
    if (!second_name) {
      // Делаем поле ошибки видимым. Оно уже хранит текст описания ошибки.
      document.getElementById("second_name_error").classList.add('display_class');
    }
    // Иначе
    else {
      // Отключает ввод текста в поле и кнопку, а также прячем поле с ошибкой, если оно было видно.
      document.getElementById("second_name").disabled = true;
      document.getElementById("second_name_button").disabled = true;
      // Изменяем цвет кнопки на зеленый и текст - на белый.
      document.getElementById("second_name_button").classList.add('button_inactive');
      // Убираем стиль видимости для ошибки
      document.getElementById("second_name_error").classList.remove('display_class');
    }
  }
  // Если оба имени введены, то мы вызываем метод начала игры
  if (first_name && second_name) {
    initialize_second_window();
  }
};

/*
    Метод инициализации игры.
    Прячет часть страницы с формой ввода имен и отображает часть с самой игрой.
*/
const initialize_second_window = () => {
  // Получаем случайное число от 0 до 1. Оно определит, кому достанется первый ход.
  let rand_num = Math.floor(Math.random() * (1 - 0 + 1));

  // Прячем заголовок и секцию части ввода имен и отображаем заголовок и поле для игры.
  document.getElementById("first_header").classList.add('hide_block');
  document.getElementById("second_header").classList.add('display_block');
  document.getElementById("first_div").classList.add('hide_block');
  document.getElementById("second_div").classList.add('display_block');

  // Устанавливаем флаг, достается ли ход первому игроку.
  is_first = rand_num == 0 ? true : false;

  // Заполняем поля имен игроков и изменяем поле отображения хода с учетом очередности.
  document.getElementById("step_announce").innerText =
    "Ваш ход, " + (is_first ? first_name : second_name);
  document.getElementById("first_name_display").innerText = first_name;
  document.getElementById("second_name_display").innerText = second_name;

  document.getElementById("first_name_count").innerText = "0";
  document.getElementById("second_name_count").innerText = "0";
  document.getElementById("last_city_name").innerText = "";
};

/*
    Метод проверки введенного имени города.
*/
const check_city = () => {
  // Получение значения поля ввода имени.
  let check_value = document.getElementById("player_answer").value;

  // Получение ссылки на поле ошибки.
  let error_field = document.getElementById("player_error");

  // Если поле пустое
  if (!check_value) {
    // Вставляем в поле ошибки текст о том, что игрок должен заполнить поле, и делаем его видимым. Также в текст встраиваем имя игрока, который совершил ошибку.
    error_field.innerText = `Игрок ${
      is_first ? first_name : second_name
    } обязан ввести имя города!`;
    error_field.classList.add('display_class');
  }
  // Иначе
  else {
    /*
            Перебираем список и сверяем введенный город в нижнем регистре с городами из списка в нижнем регистре. 
            Функция some перебирает массив (список) и завершает цикл, если функция внутри передает true. Таким образом, вместо ожидания, когда цикл будет полностью пройден,
            при получении совпадения мы преждевременно завершаем цикл.
        */
    cities.some((value, _) => {
      if (value.toLowerCase() == check_value.toLowerCase()) {
        check_value = value;
        return true;
      }
    });

    // Определяем последнюю букву имени города. Пока она пустая.
    let last_letter = "";

    // Если город есть, то мы берем последнюю букву из города
    if (last_city) {
      // Определяем индекс последней буквы.
      let step_index = last_city.length - 1;
      // Если буква - ы, ъ, ь, пробел или тире, то мы перебираем слово до тех пор, пока не получим нужную букву.
      while (["ы", "ъ", "ь", " ", "-"].includes(last_city[step_index])) {
        step_index--;
      }
      last_letter = last_city[step_index].toLowerCase();
    }

    // Если есть прошлое слово и его последняя буква (которую мы искали ранее) не совпадает с первой буквой введенного имени
    if (last_city && check_value[0].toLowerCase() != last_letter) {
      // Вставляем в поле ошибки текст о том, что игрок должен начать имя с последней буквы прошлого, и делаем его видимым.
      error_field.innerText = `Введенный город должен начинаться на ${last_letter}!`;
      error_field.classList.add('display_class');
    }
    // Если слово не было найдено в списке городов
    else if (!cities.includes(check_value)) {
      // Вставляем в поле ошибки текст о том, что данного города не существует, и делаем его видимым.
      error_field.innerText = `Города ${check_value} не существует.`;
      error_field.classList.add('display_class');
    }
    // Если слово уже было использовано
    else if (used_cities.includes(check_value)) {
      // Вставляем в поле ошибки текст о том, что данный город уже был указан, и делаем его видимым.
      error_field.innerText = `Город ${check_value} уже был использован.`;
      error_field.classList.add('display_class');
    }
    // Иначе
    else {
      // Прячем поле ошибки, если оно было видимым.
      error_field.classList.remove('display_class');
      // Заменяем последний город на введенный и добавляем новый город в списке использованных.
      last_city = check_value;
      used_cities.push(check_value);
      // Заменяем имя города в поле игры в тексте "Последний город"
      document.getElementById("last_city_name").innerText = check_value;
      // Если играл первый игрок
      if (is_first) {
        // Меняем флаг, передавая ход второму игроку.
        is_first = false;
        // Меняем текст отображения хода на второго игрока и добавляем очко первому игроку.
        document.getElementById("step_announce").innerText =
          "Ваш ход, " + second_name;
        document.getElementById("first_name_count").innerText = String(
          Number(document.getElementById("first_name_count").innerText) + 1
        );
      }
      // Иначе
      else {
        // Меняем флаг, передавая ход первому игроку.
        is_first = true;
        // Меняем текст отображения хода на первого игрока и добавляем очко второму игроку.
        document.getElementById("step_announce").innerText =
          "Ваш ход, " + first_name;
        document.getElementById("second_name_count").innerText = String(
          Number(document.getElementById("second_name_count").innerText) + 1
        );
      }
      // Делаем поле ввода города пустым.
      document.getElementById("player_answer").value = "";
    }
  }
};

/*
    Метод вызывается в том случае, если один из игроков решил сдаться.
    В качестве параметра он принимает строку-определение, какой из игроков решил сдаться.
*/
const give_up = (user) => {
  // Если сдался первый игрок.
  if (user == "first") {
    // Меняем текст в поздравлении победителя с учетом второго игрока, а также передаем полю результата текст со счетом второго игрока.
    document.getElementById(
      "congrats"
    ).innerText = `Поздравляем Вас, ${second_name}! Вы - победитель!`;
    document.getElementById(
      "score"
    ).innerText = `Ваш результат (количество отгаданных городов): ${
      document.getElementById("second_name_count").innerText
    }!`;
  }
  // Иначе
  else {
    // Меняем текст в поздравлении победителя с учетом первого игрока, а также передаем полю результата текст со счетом первого игрока.
    document.getElementById(
      "congrats"
    ).innerText = `Поздравляем Вас, ${first_name}! Вы - победитель!`;
    document.getElementById(
      "score"
    ).innerText = `Ваш результат (количество отгаданных городов): ${
      document.getElementById("first_name_count").innerText
    }!`;
  }
  // Прячем секцию самой игры и выводим секцию результата.
  document.getElementById("second_header").classList.remove('display_block');
  document.getElementById("second_div").classList.remove('display_block');
  document.getElementById("third_div").classList.add('display_block');
};

/*
    Метод перезапуска игры. Очищает данные прошлых игроков и отображает начало.
*/
const start_new = () => {
  // Очищаем данные прошлых игроков
  used_cities = [];
  first_name = "";
  second_name = "";
  last_city = "";

  // Очищаем содержимое полей ввода имен и открываем их для изменений
  document.getElementById("first_name").value = "";
  document.getElementById("first_name").disabled = false;
  document.getElementById("second_name").value = "";
  document.getElementById("second_name").disabled = false;

  // Делаем кнопки ввода имен вновь доступными
  document.getElementById("first_name_button").disabled = false;
  document.getElementById("first_name_button").classList.remove('button_inactive');
  document.getElementById("second_name_button").disabled = false;
  document.getElementById("second_name_button").classList.remove('button_inactive');

  // Открываем начальное окно ввода текста
  document.getElementById("third_div").classList.remove('display_block');
  document.getElementById("first_header").classList.remove('hide_block');
  document.getElementById("first_div").classList.remove('hide_block');
};
